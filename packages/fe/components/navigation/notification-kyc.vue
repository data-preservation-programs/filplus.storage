<template>
  <div class="notification-kyc">

    <!-- Heading -->
    <div class="notification-heading">
      <IconKycNotificationSuccess
        v-if="notification.custom.event !== 'failure'"
        class="icon-kyc-notification-success" />
      <IconKycNotificationFailure
        v-else
        class="icon-kyc-notification-failure" />
      KYC {{ stateMap[notification.custom.event] }}
    </div>

    <!-- Message -->
    <div :class="['message', notification.custom.event]">
      <!-- Success/Approve -->
      <template v-if="notification.custom.event !== 'failure'">
        <IconKycSuccess class="icon-kyc-success" />
        {{ getKycButtonText(notification.custom.event) }}
      </template>
      <!-- Failure -->
      <template v-else>
        <div class="error-name">
          {{ notification.custom.failure.name }}
        </div>
        <div class="error-message">
          {{ notification.custom.failure.message }}
        </div>
        <ButtonX
          :to="togggleLink"
          class="kyc-button"
          tag="a"
          target="_blank">
          <div class="link-text">
            Confirm identity
          </div>
          <IconLinkExternal class="icon-link-external" />
        </ButtonX>
      </template>
    </div>

    <!-- Timeago -->
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
import { mapGetters } from 'vuex'

import Timeago from '@/components/timeago'
import ButtonX from '@/components/buttons/button-x'

import IconKycNotificationSuccess from '@/components/icons/kyc-notification-success'
import IconKycNotificationFailure from '@/components/icons/kyc-notification-failure'
import IconKycSuccess from '@/components/icons/kyc-success'
import IconLinkExternal from '@/components/icons/link-external'

// ====================================================================== Export
export default {
  name: 'NotificationApplication',

  components: {
    Timeago,
    ButtonX,
    IconKycNotificationSuccess,
    IconKycNotificationFailure,
    IconKycSuccess,
    IconLinkExternal
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
        failure: 'Failed',
        success: 'Successful',
        approve: 'Successful'
      }
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      account: 'auth/account'
    }),
    kycButtonContent () {
      return this.siteContent.general.navigation.kyc_button
    },
    togggleLink () {
      return `${this.$config.togggleLink}&identifier=${this.account.githubUsername}`
    }
  },

  methods: {
    getKycButtonText (status) {
      return this.kycButtonContent[status].text
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.notification-heading {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.icon-kyc-notification-success,
.icon-kyc-notification-failure {
  width: toRem(18);
  height: toRem(18);
  margin-right: 0.5rem;
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

.message,
.link-text,
.error-name {
  font-size: toRem(14);
  font-weight: 500;
  line-height: 1;
}

.message {
  &:not(.failure) {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  &.failure {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.icon-kyc-success {
  width: toRem(15);
  height: toRem(15);
  margin-right: 0.5rem;
}

.icon-link-external {
  width: toRem(13);
  height: toRem(13);
  margin-bottom: toRem(2);
  margin-left: toRem(6);
}

.error-name {
  color: $mandysPink;
  margin-top: 0.5rem;
}

.error-message {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  line-height: leading(24, 16);
}

:deep(.kyc-button) {
  margin-bottom: 0.25rem;
  &:hover {
    .link-text {
      text-decoration: underline;
    }
  }
  .button-content {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .link-text {
    color: $greenYellow;
  }
}

.timeago {
  font-size: toRem(14);
  line-height: leading(18, 14);
  color: $nandor;
}
</style>
