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
      <div
        v-for="notification in notificationList"
        :key="notification._id"
        class="notification">

        <div class="notification-code" style="font-size: 8px;">
          {{ notification }}
        </div>

        <!-- <div class="message" v-html="notification.message" />

        <Timeago
          v-slot="{ convertedDate }"
          :date="new Date(notification.createdAt)">
          <div class="timeago">
            {{ convertedDate }}
          </div>
        </Timeago> -->

      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// import Timeago from '@/components/timeago'
import IconBell from '@/components/icons/bell'

// ====================================================================== Export
export default {
  name: 'NotificationPanel',

  components: {
    // Timeago,
    IconBell
  },

  data () {
    return {
      panelOpen: false
    }
  },

  computed: {
    ...mapGetters({
      notificationList: 'notifications/notificationList'
    })
  },

  methods: {
    togglePanel () {
      this.panelOpen = !this.panelOpen
    },
    closePanel () {
      this.panelOpen = false
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
  position: absolute;
  top: 100%;
  left: 50%;
  width: 20rem;
  max-height: 28rem;
  border: 2px solid white;
  background-color: $aztec;
  border-radius: 1rem;
  transform: translateY(2rem) translateX(-50%);
  overflow-y: scroll;
  transition: 150ms ease-out;
  &:not(.open) {
    transition: 150ms ease-in;
    transform: translateY(3rem) translateX(-50%);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}

.notification {
  padding: 1rem;
  &:not(:last-child) {
    border-bottom: 1px solid $nandor;
  }
}

:deep(.message),
.timeago {
  font-size: toRem(14);
  line-height: leading(18, 14);
}

:deep(.message) {
  margin-bottom: 0.25rem;
  a, strong {
    font-weight: 700;
  }
  a {
    color: $greenYellow;
  }
}

.timeago {
  font-size: italic;
  opacity: 0.5;
}
</style>
