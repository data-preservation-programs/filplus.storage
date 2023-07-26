<template>
  <div class="notification-application">

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
</template>

<script>
// ===================================================================== Imports
import Timeago from '@/components/timeago'

// ====================================================================== Export
export default {
  name: 'NotificationApplication',

  components: {
    Timeago
  },

  props: {
    notification: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      stateMap: {
        new: 'New Application',
        completed: 'Completed',
        validated: 'Validated',
        reviewing: 'In Review'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
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
