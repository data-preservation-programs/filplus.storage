<template>
  <div id="notifications">
    <DropdownPanel>

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
        <div v-if="notificationsFound" class="notifications-list">
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

            <div class="panel-right">
              <div class="notification-heading">
                {{ stateMap[notification.custom.state] }}
              </div>
              <div class="message">
                <a
                  :href="notification.custom.issueUrl"
                  class="issue-link"
                  target="_blank">
                  Issue #{{ notification.custom.issueNumber }}</a>:{{ notification.custom.issueTitle }}
              </div>
              <Timeago
                v-slot="{ convertedDate }"
                :date="new Date(notification.createdAt)">
                <div class="timeago">
                  {{ convertedDate }}
                </div>
              </Timeago>
            </div>

          </div>
        </div>

        <div v-else class="no-notifications-placeholder">
          ☀️ you don't have any notifications
        </div>

      </template>

    </DropdownPanel>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import DropdownPanel from '@/components/dropdown-panel'
import Timeago from '@/components/timeago'
import Spinner from '@/components/spinners/material-circle'

import IconBell from '@/components/icons/bell'
import IconCloseThick from '@/components/icons/close-thick'
import IconRefresh from '@/components/icons/refresh'

// ====================================================================== Export
export default {
  name: 'NotificationPanel',

  components: {
    DropdownPanel,
    Timeago,
    Spinner,
    IconBell,
    IconCloseThick,
    IconRefresh
  },

  data () {
    return {
      notificationsLoaded: false,
      stateMap: {
        new: 'New Application',
        completed: 'Completed',
        validated: 'Validated',
        reviewing: 'In Review'
      },
      timeout: null
    }
  },

  computed: {
    ...mapGetters({
      notificationList: 'notifications/notificationList',
      loading: 'notifications/loading',
      newCount: 'notifications/newCount'
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
    }
  },

  watch: {
    loading (loading) {
      if (!loading && !this.timeout) {
        this.timeout = setTimeout(() => {
          this.notificationsLoaded = true
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
      markNotificationsAsRead: 'notifications/markNotificationsAsRead'
    }),
    toggleDropdownPanel (togglePanel) {
      if (this.notificationsLoaded) {
        togglePanel()
      }
    },
    markRead (notification) {
      if (!notification.read) {
        this.markNotificationsAsRead([notification._id])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#notifications {
  position: relative;
  margin-left: 1rem;
  z-index: 1000;
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
  &.panel-open {
    transition: 150ms ease-in;
    transform: scale(1.15);
    border-color: $greenYellow;
  }
  &:hover {
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
  // transition: 150ms ease-out;
  &:hover {
    // transition: 150ms ease-in;
    transform: rotate(180deg) scale(1.15);
    &:active {
      transform: rotate(180deg) scale(0.8);
    }
  }
}

.icon-refresh {
  display: block;
  width: toRem(28);
}

.notifications-list {
  flex: 1;
  max-height: 28rem;
  overflow-y: scroll;
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

.notification-heading,
.message {
  margin-bottom: toRem(5);
  font-size: 1rem;
  line-height: leading(24, 16);
}

.issue-link {
  font-size: inherit;
  font-weight: 500;
  color: $greenYellow;
  &:hover {
    text-decoration: underline;
  }
}

.notification-heading {
  font-weight: 600;
}

.timeago {
  font-size: toRem(14);
  line-height: leading(18, 14);
  color: $nandor;
}
</style>
