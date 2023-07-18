<template>
  <div id="profile">
    <DropdownPanel :toggle-on="toggleOn" @dropdownPanelToggled="dropdownPanelToggled">

      <!-- =================================================== Toggle button -->
      <template #toggle-button="{ togglePanel, panelOpen }">
        <button
          :class="['profile-toggle-button', { 'panel-open': panelOpen }]"
          @click="togglePanel">
          <div class="profile-toggle-button-inner-container">
            <IconCloseThick class="icon close" />
            <img :src="account.githubAvatarUrl" class="avatar in-toggle-button" />
          </div>
        </button>
      </template>

      <!-- =========================================================== Panel -->
      <template #dropdown-panel>

        <!-- User Preview -->
        <div class="user-preview">
          <img :src="account.githubAvatarUrl" class="avatar in-user-preview" />
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

import IconCloseThick from '@/components/icons/close-thick'

// ====================================================================== Export
export default {
  name: 'ProfilePanel',

  components: {
    DropdownPanel,
    Logout,
    ButtonX,
    KycButton,
    IconCloseThick
  },

  props: {
    toggleOn: {
      type: String,
      required: true
    }
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
  },

  methods: {
    dropdownPanelToggled (state) {
      this.$emit('dropdownPanelToggled', { panel: 'profile', state })
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
    .avatar.in-toggle-button {
      transition: 150ms ease-in;
      transform: scale(1.15);
    }
  }
  &:hover {
    &.panel-open {
      :deep(.icon.close) {
        transform: translateY(0) rotate(90deg);
      }
    }
  }
  &.panel-open {
    .avatar.in-toggle-button {
      transition: 150ms ease-in;
      opacity: 0;
      transform: translateY(-100%) scale(0.5);
    }
    :deep(.icon.close) {
      transition: 150ms ease-in;
      transform: translateY(0);
      opacity: 1;
    }
  }
}

.profile-toggle-button-inner-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.avatar.in-toggle-button,
.icon.close {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.avatar {
  &.in-toggle-button {
    width: 100%;
    height: 100%;
    transition: 150ms ease-out;
  }
  &.in-user-preview {
    width: toRem(28);
    height: toRem(28);
    margin-right: toRem(10);
    border: 1px solid $greenYellow;
    border-radius: 50%;
  }
}

:deep(.icon.close) {
  display: block;
  width: toRem(12);
  opacity: 0;
  transform: translateY(100%);
  transition: 150ms ease-out;
  path {
    fill: $greenYellow;
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
    &.success,
    &.approve {
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
