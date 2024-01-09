<template>
  <div id="notifications">
    <DropdownPanel @dropdownPanelToggled="dropdownPanelToggled">

      <!-- =================================================== Toggle button -->
      <template #toggle-button="{ togglePanel, panelOpen }">
        <button
          :class="[
            'notification-toggle-button', {
              'panel-open': panelOpen,
              'loaded': notificationsLoaded,
              'new-notifications-exist': newNotificationsExist
            }
          ]"
          @click="toggleDropdownPanel(togglePanel)">
          <div class="notification-toggle-button-inner-container">
            <Spinner />
            <IconBell class="icon bell" />
            <IconCloseThick class="icon close" />
          </div>
        </button>
      </template>

      <!-- =========================================================== Panel -->
      <template #dropdown-panel>

        <!-- Header -->
        <header class="header">
          <div class="text">
            Notifications {{ newNotificationsCount }}
          </div>
          <button
            class="refresh-button"
            @click="getNotificationList()">
            <IconRefresh class="icon-refresh" />
          </button>
        </header>

        <!-- Notifications List -->
        <div v-if="notificationsFound" class="notifications-list-wrapper">
          <div :class="['gradient top', { active: displayGradient === 'top' || displayGradient === true }]" />
          <div ref="notificationListPanel" class="notifications-list">
            <div
              v-for="notification in notificationList"
              :key="notification._id"
              class="notification">

              <component
                :is="notification.read ? 'div' : 'button'"
                :class="['read-status-button', { read: notification.read }]"
                data-tooltip="Mark as read"
                @click="markRead(notification)">
                <span class="read-status-indicator" />
              </component>

              <NotificationApplication
                v-if="notification.bucket === 'application'"
                :notification="notification"
                class="panel-right" />

              <NotificationKyc
                v-else-if="notification.bucket === 'kyc'"
                :notification="notification"
                class="panel-right" />

            </div>
          </div>
          <div :class="['gradient bottom', { active: displayGradient === 'bottom' || displayGradient === true }]" />
        </div>

        <div v-else class="no-notifications-placeholder">
          ☀️ you don't have any notifications
        </div>

        <!-- Footer -->
        <footer v-if="notificationsFound" class="footer">
          <button
            class="mark-all-as-read-button"
            :disabled="!newNotificationsExist"
            data-tooltip="☀️ you're all caught up"
            @click="markAllNotificationsAsRead">
            <div class="mark-all-as-read-button-content">
              Mark all as read
            </div>
          </button>
          <div class="pagination">
            <button
              :class="['prev', { disabled: prevPageDisabled }]"
              :disabled="prevPageDisabled"
              @click="iteratePage('prev', pageMetadata.page - 1)">
              <svg width="4" height="7" viewBox="0 0 4 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.822 3.206L1.596 6.426H0L1.89 3.206L0 0H1.596L3.822 3.206Z" fill="white" fill-opacity="0.9" />
              </svg>
            </button>
            <div class="page">
              {{ pageMetadata.page }}/{{ pageMetadata.totalPages }}
            </div>
            <button
              :class="['next', { disabled: nextPageDisabled }]"
              :disabled="nextPageDisabled"
              @click="iteratePage('next', pageMetadata.page + 1)">
              <svg width="4" height="7" viewBox="0 0 4 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.822 3.206L1.596 6.426H0L1.89 3.206L0 0H1.596L3.822 3.206Z" fill="white" fill-opacity="0.9" />
              </svg>
            </button>
          </div>
        </footer>

      </template>

    </DropdownPanel>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import DropdownPanel from '@/components/dropdown-panel'
import NotificationApplication from '@/components/navigation/notification-application'
import NotificationKyc from '@/components/navigation/notification-kyc'
import Spinner from '@/components/spinners/material-circle'

import IconBell from '@/components/icons/bell'
import IconCloseThick from '@/components/icons/close-thick'
import IconRefresh from '@/components/icons/refresh'

// ====================================================================== Export
export default {
  name: 'NotificationPanel',

  components: {
    DropdownPanel,
    NotificationApplication,
    NotificationKyc,
    Spinner,
    IconBell,
    IconCloseThick,
    IconRefresh
  },

  data () {
    return {
      notificationsLoaded: false,
      timeout: null,
      scrull: null,
      displayGradient: 'bottom'
    }
  },

  computed: {
    ...mapGetters({
      notificationList: 'notifications/notificationList',
      loading: 'notifications/loading',
      newCount: 'notifications/newCount',
      pageMetadata: 'notifications/metadata'
    }),
    notificationsFound () {
      const notificationList = this.notificationList
      return notificationList && notificationList.length > 0
    },
    newNotificationsCount () {
      const count = this.newCount
      return count > 0 ? `(${count} new)` : ''
    },
    newNotificationsExist () {
      return this.newCount > 0
    },
    prevPageDisabled () {
      return this.pageMetadata.page === 1
    },
    nextPageDisabled () {
      return this.pageMetadata.page === this.pageMetadata.totalPages
    }
  },

  watch: {
    loading (loading) {
      if (!loading && !this.timeout) {
        this.timeout = setTimeout(() => {
          this.notificationsLoaded = true
          this.$nextTick(() => {
            if (!this.scroll) {
              this.watchScroll()
            }
            const notificationListPanel = this.$refs.notificationListPanel
            if (notificationListPanel && notificationListPanel.scrollHeight <= notificationListPanel.clientHeight) {
              this.displayGradient = false
            } else if (!this.displayGradient) {
              this.displayGradient = 'bottom'
            }
            this.$scrollToY(0, 250, false, this.$refs.notificationListPanel)
          })
          clearTimeout(this.timeout)
          this.timeout = null
        }, 500)
      } else if (loading) {
        this.notificationsLoaded = false
      }
    }
  },

  methods: {
    ...mapActions({
      getNotificationList: 'notifications/getNotificationList',
      markNotificationsAsRead: 'notifications/markNotificationsAsRead',
      markAllNotificationsAsRead: 'notifications/markAllNotificationsAsRead'
    }),
    watchScroll () {
      const scrollHandler = (e) => {
        if (e) {
          const y = e.target.scrollTop
          const height = e.target.clientHeight
          const atTopOfScroll = y === 0
          const atBottomOfScroll = e.target.scrollHeight - y - height <= 0
          if (atTopOfScroll) {
            this.displayGradient = 'bottom'
          } else if (atBottomOfScroll) {
            this.displayGradient = 'top'
          } else if (this.displayGradient !== true) {
            this.displayGradient = true
          }
        }
      }; scrollHandler()
      this.scroll = this.$throttle(scrollHandler, 1)
      const notificationListPanel = this.$refs.notificationListPanel
      if (notificationListPanel) {
        notificationListPanel.addEventListener('scroll', this.scroll)
      }
    },
    toggleDropdownPanel (togglePanel) {
      if (this.notificationsLoaded) {
        togglePanel()
      }
    },
    markRead (notification) {
      if (!notification.read) {
        this.markNotificationsAsRead([notification._id])
      }
    },
    iteratePage (action, page) {
      if ((action === 'prev' && this.prevPageDisabled) || (action === 'next' && this.nextPageDisabled)) { return }
      this.getNotificationList(page)
    },
    dropdownPanelToggled (state) {
      this.$emit('dropdownPanelToggled', { panel: 'notification', state })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#notifications {
  position: relative;
  margin-left: 1rem;
  z-index: 500;
}

// ////////////////////////////////////////////////////////////////////// Button
.notification-toggle-button {
  display: flex;
  width: toRem(35);
  height: toRem(35);
  border: 2px solid $greenYellow;
  border-radius: 50%;
  transition: 150ms ease-out;
  &:hover,
  &:focus-visible,
  &.panel-open {
    transition: 150ms ease-in;
    transform: scale(1.15);
  }
  &:focus-visible {
    @include focusBoxShadow;
  }
  &:hover,
  &:focus-within {
    &.panel-open {
      :deep(.icon) {
        &.close {
          transform: translateY(0) rotate(90deg);
        }
      }
    }
  }
  &:not(.loaded) {
    cursor: no-drop;
    &.panel-open {
      .spinner {
        transition: 150ms ease-in;
        top: 0;
        opacity: 1;
      }
      :deep(.icon) {
        transition: 150ms ease-in;
        &.close {
          transform: translateY(100%);
          opacity: 0;
        }
      }
    }
  }
  &.loaded {
    .spinner {
      transition: 150ms ease-in;
      top: -100%;
      opacity: 0;
    }
    :deep(.icon) {
      transition: 150ms ease-in;
      &.bell {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
  &.panel-open {
    :deep(.icon) {
      transition: 150ms ease-in;
      &.bell {
        transform: translateY(-100%);
        opacity: 0;
      }
      &.close {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
  &.new-notifications-exist {
    &:before,
    &:after {
      content: '';
      position: absolute;
      border-radius: 50%;
    }
    &:before {
      top: toRem(-4);
      right: toRem(-4);
      width: toRem(18);
      height: toRem(18);
      background-color: #040706;
    }
    &:after {
      top: 0;
      right: 0;
      width: toRem(9);
      height: toRem(9);
      background-color: $redOrange;
    }
  }
}

.notification-toggle-button-inner-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.spinner,
.icon {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

:deep(svg.spinner) {
  width: 1rem;
  height: 1rem;
  circle {
    stroke: white;
  }
}

:deep(.icon) {
  display: block;
  transition: 150ms ease-out;
  opacity: 0;
  &.bell {
    width: toRem(15);
    transform: translateY(100%);
  }
  &.close {
    width: toRem(12);
    transform: translateY(200%);
  }
  path {
    fill: $greenYellow;
  }
}

// /////////////////////////////////////////////////////////////////////// Panel
:deep(.panel) {
  width: 20rem;
  border-radius: toRem(30);
}

.header,
.notification {
  padding: 1rem;
  &:not(:last-child) {
    border-bottom: 2px solid $mineralGreen;
  }
}

.no-notifications-placeholder {
  padding: 1rem;
}

.header {
  @include h6;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.refresh-button {
  &:hover,
  &:focus-visible {
    transform: rotate(180deg) scale(1.15);
    &:active {
      transition: 50ms ease-in;
      transform: rotate(180deg) scale(0.8);
    }
  }
  &:focus-visible {
    @include focusOutlineWithOffset;
    border-radius: 50%;
  }
}

.icon-refresh {
  display: block;
  width: toRem(28);
}

.notifications-list-wrapper {
  flex: 1;
  position: relative;
}

.gradient {
  position: absolute;
  left: 0;
  width: 100%;
  height: toRem(120);
  opacity: 0;
  pointer-events: none;
  z-index: 100;
  transition: 150ms ease-out;
  &.top {
    top: 0;
    background: linear-gradient(to bottom, #0C1512 0%, rgba(12, 21, 18, 0) 76.04%);
  }
  &.bottom {
    bottom: 0;
    background: linear-gradient(to top, #0C1512 0%, rgba(12, 21, 18, 0) 76.04%);
  }
  &.active {
    transition: 250ms ease-in;
    opacity: 1;
  }
}

.notifications-list {
  max-height: 28rem;
  overflow-y: scroll;
  @include small {
    max-height: 24rem;
  }
}

.notification {
  display: flex;
  flex-direction: row;
  padding-left: 0;
}

.read-status-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 3rem;
  padding-top: 0.5rem;
  &[data-tooltip] {
    z-index: 10;
    &:before {
      top: toRem(25);
    }
    &:after {
      top: toRem(22 + 8);
      left: calc(100% - 3px);
    }
  }
  &:not(.read) {
    &:hover {
      .read-status-indicator {
        transition: 150ms ease-in;
        transform: scale(1.3);
      }
    }
  }
  &.read {
    &[data-tooltip] {
      &:before,
      &:after {
        opacity: 0;
      }
    }
    .read-status-indicator {
      background-color: $mineralGreen;
    }
  }
}

.read-status-indicator {
  width: toRem(10);
  height: toRem(10);
  border-radius: 50%;
  background-color: $greenYellow;
  transition: 150ms ease-out;
}

.panel-right {
  flex: 1;
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  padding-left: toRem(19);
  border-top: 2px solid $greenYellow;
}

.mark-all-as-read-button-content,
.prev,
.page,
.next {
  font-size: toRem(14);
  line-height: leading(30, 14);
  font-weight: 500;
}

$offset: calc(#{toRem(19)} + #{toRem(math.div(10, 2))} + #{toRem(5)});

.mark-all-as-read-button {
  &[data-tooltip] {
    &:hover {
      &:before {
        transform: rotate(180deg) translate(50%, 0);
      }
      &:after {
        transform: translate(-50%, 0);
      }
    }
    &:before,
    &:after {
      top: auto;
      z-index: 1000;
    }
    &:before {
      bottom: calc(100% + 2px);
      transform: rotate(180deg) translate(50%, 1rem);
    }
    &:after {
      bottom: calc(100% + 0.5rem);
      transform: translate(-50%, -0.5rem);
    }
  }
  &:not([disabled]) {
    .mark-all-as-read-button-content {
      transition: 150ms ease-in;
      cursor: pointer;
      opacity: 1;
      &:hover {
        &:before {
          transition: 150ms ease-in;
          transform: scale(1.3);
        }
        &:after {
          transition: 150ms ease-in;
          width: calc(100% - #{$offset});
        }
      }
    }
    [data-tooltip] {
      display: none;
    }
  }
}

.mark-all-as-read-button-content {
  transition: 150ms ease-out;
  cursor: no-drop;
  opacity: 0.5;
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: $offset;
    width: 0px;
    height: 4px;
    background-color: $greenYellow;
    transform: translateY(-50%);
    transition: 150ms ease-out;
  }
  &:before {
    content: '';
    display: inline-block;
    width: toRem(10);
    height: toRem(10);
    border-radius: 50%;
    margin-right: toRem(11 + 5);
    background-color: $mineralGreen;
    transition: 150ms ease-out;
  }
}

.pagination {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.prev,
.next {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  &:not(.disabled):hover {
    &:before {
      transition: 150ms ease-in;
      opacity: 1;
    }
    svg {
      transition: 150ms ease-in;
      transform: scale(1.2);
    }
  }
  &.disabled {
    cursor: no-drop;
    opacity: 0.5;
  }
  &:before {
    content: '';
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    width: calc(100% - 0.5rem);
    height: calc(100% - 0.5rem);
    background-color: rgba(246, 245, 255, 0.2);
    border-radius: toRem(3);
    opacity: 0;
    transition: 150ms ease-out;
  }
  svg {
    transition: 150ms ease-out;
  }
}

.prev {
  &:not(.disabled):hover {
    svg {
      transform: rotate(180deg) scale(1.2);
    }
  }
  svg {
    transform: rotate(180deg);
  }
}
</style>
