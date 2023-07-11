<template>
  <div id="profile">
    <DropdownPanel toggle-on="hover">
    
      <!-- =================================================== Toggle button -->
      <template #toggle-button="{ togglePanel, panelOpen }">
        <button
          :class="['profile-toggle-button', { 'panel-open': panelOpen }]"
          @click="togglePanel">
          <img :src="account.githubAvatarUrl" class="avatar" />
        </button>
      </template>

      <!-- =========================================================== Panel -->
      <template #dropdown-panel>

        <!-- User Preview -->
        <div class="user-preview">
          <img :src="account.githubAvatarUrl" class="avatar" />
          <span class="username">
            {{ account.githubUsername }}
          </span>
        </div>

        <!-- [Button] Application History Page -->
        <ButtonX
          :to="applicationHistoryButton.href"
          :selected="$isRouteCurrent($route, applicationHistoryButton.href)"
          :tag="applicationHistoryButton.type"
          class="auth-link">
          <div class="link-text" v-html="applicationHistoryButton.label" />
        </ButtonX>

        <!-- [Button] KYC -->
        <KycButton
          v-if="account"
          theme="bare"
          class="kyc-link" />

        <!-- [Button] Logout -->
        <Logout v-slot="{ logout }">
          <ButtonX
            class="auth-link button-logout"
            loader="logout-button"
            @clicked="logout">
            <div class="link-text">
              Logout
            </div>
          </ButtonX>
        </Logout>

      </template>

    </DropdownPanel>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import DropdownPanel from '@/components/dropdown-panel'
import ButtonX from '@/components/buttons/button-x'
import Logout from '@/modules/auth/components/logout'
import KycButton from '@/components/kyc-button'

// ====================================================================== Export
export default {
  name: 'ProfilePanel',

  components: {
    DropdownPanel,
    Logout,
    ButtonX,
    KycButton
  },

  computed: {
    ...mapGetters({
      account: 'auth/account'
    }),
    applicationHistoryButton () {
      return {
        type: 'nuxt-link',
        href: `/account/${this.account.githubUsername}/applications`,
        label: 'Application History'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#profile {
  position: relative;
  z-index: 2000;
}

.profile-toggle-button {
  display: block;
  width: toRem(35);
  height: toRem(35);
  border-radius: 50%;
  border: 2px solid $greenYellow;
  overflow: hidden;
  transition: 150ms ease-out;
  &:hover,
  &.panel-open {
    transition: 150ms ease-in;
    transform: scale(1.15);
    border-color: $greenYellow;
    .avatar {
      transition: 150ms ease-in;
      transform: scale(1.15);
    }
  }
  .avatar {
    width: 100%;
    height: 100%;
    transition: 150ms ease-out;
  }
}

// /////////////////////////////////////////////////////////////////////// Panel
:deep(.panel) {
  width: toRem(200);
  border-radius: toRem(18);
}

.user-preview,
.auth-link.button,
.kyc-link {
  padding: toRem(2) 1rem;
}

.user-preview {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: toRem(10);
  .avatar {
    width: toRem(28);
    height: toRem(28);
    margin-right: toRem(10);
    border: 1px solid $greenYellow;
    border-radius: 50%;
  }
}

.username {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1rem;
  font-weight: 500;
  color: $greenYellow;
}

:deep(.auth-link.button-x),
:deep(.kyc-link.tooltip) {
  .inner-content {
    transition: 150ms ease-in;
  }
  &:hover {
    .inner-content {
      color: $greenYellow;
    }
  }
}

.auth-link.button {
  display: inline-block;
}

:deep(.kyc-link.tooltip) {
  display: flex;
  .kyc-button {
    &.success {
      cursor: no-drop;
      .inner-content {
        color: $greenYellow;
      }
    }
  }
  .tooltip-content-wrapper {
    display: none;
  }
}

:deep(.button-logout.button-x) {
  padding-bottom: toRem(10);
  .inner-content {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .button-content.hide {
    opacity: 1;
  }
  .triple-dot-loader {
    position: static;
    display: none;
    opacity: 1;
    margin-left: 0.5rem;
    &.show {
      display: flex;
    }
    .dot {
      width: 0.5rem;
      height: 0.5rem;
    }
  }
}

:deep(.link-text) {
  font-size: 1rem;
  font-weight: 500;
  line-height: leading(35, 18);
}
</style>
