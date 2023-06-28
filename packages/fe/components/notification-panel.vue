<template>
  <div
    id="notifications"
    v-click-outside="closePanel">

    <!-- ===================================================== Toggle button -->
    <button
      :class="['notification-toggle-button', { 'panel-open': panelOpen }]"
      @click="togglePanel">
      <IconBell class="icon" />
    </button>

    <!-- ============================================================= Panel -->
    <div
      :class="['notifications-panel', { open: panelOpen }]">

      <div class="squiggly">
        <svg
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_3637_18381)">
            <path d="M274 70V710C274 726.016 261.016 739 245 739H-8C-24.0163 739 -37 726.016 -37 710V70C-37 53.9838 -24.0163 41 -8 41H-6.875H0.1875C4.88297 41 9.2263 38.4065 11.4277 34.253C15.3746 26.8059 25.9855 26.643 30.1592 33.9653L30.431 34.4421C32.7421 38.4967 37.0504 41 41.7174 41H48.875H245C261.016 41 274 53.9837 274 70Z" fill="#101A17" stroke="white" stroke-width="2" />
          </g>
          <defs>
            <clipPath id="clip0_3637_18381">
              <rect width="42" height="42" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <header class="header">
        Notifications (3 new)
      </header>

      <div class="notifications-list">
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
              Issue #{{ notification.custom.issueNumber }}: {{ notification.custom.issueTitle }}
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

    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Timeago from '@/components/timeago'
import IconBell from '@/components/icons/bell'

// ====================================================================== Export
export default {
  name: 'NotificationPanel',

  components: {
    Timeago,
    IconBell
  },

  data () {
    return {
      panelOpen: false,
      stateMap: {
        completed: 'Completed',
        validated: 'validated',
        reviewing: 'In Review'
      }
    }
  },

  computed: {
    ...mapGetters({
      notificationList: 'notifications/notificationList'
    })
  },

  methods: {
    ...mapActions({
      markNotificationsAsRead: 'notifications/markNotificationsAsRead'
    }),
    togglePanel () {
      this.panelOpen = !this.panelOpen
    },
    closePanel () {
      this.panelOpen = false
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
  width: toRem(44);
  height: toRem(44);
  margin-left: 1rem;
  z-index: 1000;
}

// ////////////////////////////////////////////////////////////////////// Button
.notification-toggle-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 2px solid $titanWhite;
  border-radius: 50%;
  transition: 150ms ease-out;
  &:hover,
  &.panel-open {
    transition: 150ms ease-in;
    border-color: $greenYellow;
  }
}

:deep(.icon) {
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  path {
    fill: white;
  }
}

// /////////////////////////////////////////////////////////////////////// Panel
.notifications-panel {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 50%;
  width: 20rem;
  max-height: 28rem;
  border: 2px solid white;
  background-color: $racingGreen;
  border-radius: toRem(30);
  transform: translateY(2.5rem) translateX(-50%);
  transition: 150ms ease-out;
  &:not(.open) {
    transition: 150ms ease-in;
    transform: translateY(3.5rem) translateX(-50%);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}

$squigglyWidth: 40;

.squiggly {
  position: absolute;
  top: toRem(-$squigglyWidth);
  left: 50%;
  width: toRem($squigglyWidth);
  height: toRem($squigglyWidth);
  transform: translateX(-50%);
  &:before {
    content: '';
    position: absolute;
    top: 100%;
    width: 100%;
    height: 1px;
    background-color: $racingGreen;
  }
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.header,
.notification {
  padding: 1rem;
  &:not(:last-child) {
    border-bottom: 2px solid $mineralGreen;
  }
}

.header {
  @include h6;
}

.notifications-list {
  flex: 1;
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
    &:before {
      top: toRem(25);
    }
    &:after {
      top: toRem(22 + 8);
      left: calc(100% - 3px);
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
  transition: 150ms ease-in-out;
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

.notification-heading {
  font-weight: 600;
}

.timeago {
  font-size: toRem(14);
  line-height: leading(18, 14);
  color: $nandor;
}
</style>
