<template>
  <Tooltip
    v-if="!hideButton"
    :align="tooltipAlign">

    <template #tooltip-trigger>
      <ButtonX
        :to="togggleLink"
        :class="['kyc-button', status, `theme__${theme}`]"
        :tag="kycButtonType"
        :target="kycButtonTarget">

        <div class="icon">
          <IconKycVerifying
            v-if="status === 'verifying'"
            class="icon-kyc-verifying" />
          <IconKycSuccess
            v-else
            class="icon-kyc-success" />
        </div>

        <div class="link-text">
          {{ kycButton.text }}
        </div>

        <div v-if="showExternalLinkIcon" class="icon">
          <IconLinkExternal class="icon-link-external" />
        </div>

      </ButtonX>
    </template>

    <template v-if="tooltip" #tooltip-content>
      <div class="tooltip-content" v-html="tooltip" />
    </template>

  </Tooltip>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Tooltip from '@/components/tooltip'
import ButtonX from '@/components/buttons/button-x'

import IconKycVerifying from '@/components/icons/kyc-verifying'
import IconKycSuccess from '@/components/icons/kyc-success'
import IconLinkExternal from '@/components/icons/link-external'

// ====================================================================== Export
export default {
  name: 'KycButton',

  components: {
    Tooltip,
    ButtonX,
    IconKycVerifying,
    IconKycSuccess,
    IconLinkExternal
  },

  props: {
    theme: { // 'bare', 'full'
      type: String,
      required: false,
      default: 'bare'
    },
    tooltipAlign: {
      type: String,
      required: false,
      default: 'center'
    },
    goToTogggle: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      account: 'auth/account'
    }),
    onKycPage () {
      return this.$route.path.includes('kyc')
    },
    status () { // 'unverified', 'verifying', 'failure', 'success', 'approve'
      const kyc = this.account.kyc
      if (!kyc) { return 'unverified' }
      return kyc.event
    },
    hideButton () {
      // return this.theme === 'bare' && this.status === 'failure'
      return false
    },
    showExternalLinkIcon () {
      const status = this.status
      // return status === 'unverified' || status === 'verifying'
      return this.goToTogggle && (status === 'unverified' || status === 'verifying' || status === 'failure')
    },
    kycButtonType () {
      const status = this.status
      if (status === 'success' || status === 'approve' || (this.onKycPage && !this.goToTogggle)) { return 'div' }
      if (!this.goToTogggle) { return 'nuxt-link' }
      return 'a'
    },
    kycButtonTarget () {
      if (this.onKycPage) { return '_blank' }
      return undefined
    },
    kycButtonContent () {
      return this.siteContent.general.navigation.kyc_button
    },
    kycButton () {
      return this.kycButtonContent[this.status] || this.kycButtonContent.default
    },
    text () {
      return this.kycButton.text
    },
    togggleLink () {
      if (!this.goToTogggle) { return '/kyc' }
      return `${this.$config.togggleLink}&identifier=${this.account.githubUsername}`
    },
    tooltip () {
      let tooltip = this.kycButton.tooltip
      if (!tooltip) { return false }
      tooltip = tooltip.replaceAll('|Start_kyc_link|', `<a href="${this.togggleLink}" target="_blank">Start KYC</a>`)
      tooltip = tooltip.replaceAll('|start_kyc_link|', `<a href="${this.togggleLink}" target="_blank">start KYC</a>`)
      tooltip = tooltip.replaceAll('|Check_status_link|', `<a href="${this.togggleLink}" target="_blank">Check status</a>`)
      tooltip = tooltip.replaceAll('|reach_out_link|', '<a href="https://filecoinproject.slack.com/archives/C01DLAPKDGX" target="_blank">reach out</a>')
      tooltip = tooltip.replaceAll('|try_again_link|', `<a href="${this.togggleLink}" target="_blank">try again</a>`)
      return tooltip
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.kyc-button {
  display: block;
}

:deep(.button-content) {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.icon {
  display: flex;
}

.icon-kyc-verifying,
.icon-kyc-success {
  width: toRem(15);
  height: toRem(15);
}

.icon-link-external {
  width: toRem(13);
  height: toRem(13);
  margin-bottom: toRem(8);
  margin-left: toRem(6);
}

.tooltip-content {
  width: 23rem;
}

// ////////////////////////////////////////////////////////////////////// Themes
.theme__bare {
  &:not(.success):not(.approve) {
    .icon-kyc-success {
      display: none;
    }
  }
  .icon-kyc-verifying,
  .icon-kyc-success {
    margin-right: toRem(5);
  }
}

.theme__full {
  height: toRem(40);
  padding: 3px toRem(22) 3px 3px;
  background-color: rgba(175, 142, 81, 0.6);
  border: 2px solid $laser;
  border-radius: 3rem;
  color: #EEE2A5;
  &:hover {
    transform: scale(1.05);
  }
  &:not(.success):not(.approve) {
    color: $greenYellow;
  }
  &.unverified,
  &.failure {
    // padding: 3px toRem(17);
  }
  &.success,
  &.approve/*,
  &.failure*/ {
    cursor: no-drop;
    &:hover {
      transform: none;
    }
  }
  &.verifying {
    font-style: italic;
  }
  // &.failure {
  //   background-color: $aztec;
  //   border-color: $nandor;
  //   color: $nandor;
  // }
  .link-text {
    font-size: toRem(14);
    font-weight: 500;
    line-height: 1;
  }
  .icon-kyc-success,
  .icon-kyc-verifying {
    margin-right: toRem(10);
  }
  :deep(.icon-kyc-verifying) {
    width: 2rem;
    height: 2rem;
    circle {
      stroke: $aztec;
      &:not(:first-child) {
        fill: $aztec;
      }
    }
  }
  .icon-kyc-success {
    width: toRem(30);
    height: toRem(30);
  }
}
</style>
