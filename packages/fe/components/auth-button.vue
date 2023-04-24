<template>
  <div class="auth-button">

    <!-- ====================================================== Login button -->
    <Login v-if="!account" v-slot="{ loginWith }">
      <ButtonB
        class="login-button"
        loader="login-button"
        @clicked="loginWith('github')">
        <IconGithub class="icon-github" />
        <span>Login / Register</span>
      </ButtonB>
    </Login>

    <!-- ========================================================== Dropdown -->
    <Dropdown v-else>
      <!-- .......................................................... window -->
      <template #window="{ dropdownOpen }">
        <div :class="['window', { 'dropdown-open': dropdownOpen }]">
          <div class="panel-left">
            <img :src="account.githubAvatarUrl" class="avatar" />
            <span class="username">
              {{ githubUsername }}
            </span>
          </div>
          <IconChevron />
        </div>
      </template>

      <!-- ......................................................... options -->
      <template #options>
        <div class="options">
          <ButtonX
            :to="applicationHistoryButton.href"
            :selected="$isRouteCurrent($route, applicationHistoryButton.href)"
            :tag="applicationHistoryButton.type"
            class="auth-link">
            <div class="link-text" v-html="applicationHistoryButton.label" />
          </ButtonX>
          <ButtonX
            :to="kycTogggleGetVerifiedButton.href"
            :tag="kycTogggleGetVerifiedButton.type"
            :target="kycTogggleGetVerifiedButton.target"
            class="kyc-link">
            <div class="link-text" v-html="kycTogggleGetVerifiedButton.label" />
          </ButtonX>
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
        </div>
      </template>

    </Dropdown>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import ButtonB from '@/components/buttons/button-b'
import ButtonX from '@/components/buttons/button-x'
import Login from '@/modules/auth/components/login'
import Logout from '@/modules/auth/components/logout'
import Dropdown from '@/components/dropdown'

import IconGithub from '@/components/icons/github'
import IconChevron from '@/components/icons/chevron'

// ====================================================================== Export
export default {
  name: 'AuthButton',

  components: {
    Login,
    Logout,
    ButtonB,
    ButtonX,
    Dropdown,
    IconGithub,
    IconChevron
  },

  computed: {
    ...mapGetters({
      account: 'auth/account'
    }),
    githubUsername () {
      return this.account.githubUsername
    },
    applicationHistoryButton () {
      return {
        type: 'nuxt-link',
        href: `/account/${this.githubUsername}/applications`,
        label: 'Application History Page'
      }
    },
    kycTogggleGetVerifiedButton () {
      return {
        type: 'a',
        href: `${this.$config.togggleLink}?token=${this.githubUsername}`, // togggleLink can be found in nuxt.config.js
        target: '_blank',
        label: 'Get Verified'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ////////////////////////////////////////////////////////////// [Button] login
.login-button {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  &:not([disabled]) {
    &:hover {
      color: $aztec;
      transform: scale(1.05);
      :deep(path) {
        transition: 150ms ease-in;
        fill: $aztec;
      }
      :deep(.triple-dot-loader) {
        .dot {
          background-color: $aztec;
        }
      }
    }
  }
  :deep(.triple-dot-loader) {
    .dot {
      background-color: $greenYellow;
    }
  }
}

.icon-github {
  width: 1rem;
  margin-right: 0.75rem;
  :deep(path) {
    fill: $greenYellow;
    transition: 150ms ease-out;
  }
}

// /////////////////////////////////////////////////////////// [Dropdown] logout
:deep(.dropdown) {
  &:hover {
    &:not(.open) {
      .dropdown-backdrop {
        border-color: $greenYellow;
      }
    }
  }
  &.open {
    .dropdown-backdrop {
      border-radius: toRem(18);
      border-color: $greenYellow;
      background-color: $aztec;
    }
  }
  .dropdown-backdrop {
    border: 2px solid $titanWhite;
    border-radius: 2rem;
  }
}

.window {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: toRem(7) toRem(8);
  padding-right: toRem(12);
  cursor: pointer;
  transition: 150ms ease-out;
  &:hover {
    &.dropdown-open {
      .icon-chevron {
        transition: 150ms ease-in;
        transform: rotate(-180deg);
      }
    }
    :deep(.icon-chevron path) {
      transition: 150ms ease-in;
      stroke: $greenYellow;
    }
  }
  &.dropdown-open {
    .icon-chevron {
      transition: 150ms ease-in;
      transform: rotate(-180deg);
      :deep(path) {
        transition: 150ms ease-in;
        stroke: $greenYellow;
      }
    }
  }
}

.panel-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.avatar {
  width: toRem(28);
  height: toRem(28);
  border: 1px solid $greenYellow;
  border-radius: 50%;
  margin-right: toRem(12);
}

.username {
  line-height: 1;
  font-weight: 500;
  color: $greenYellow;
  margin-right: 1.5rem;
}

.icon-chevron {
  width: toRem(12);
  height: toRem(8);
  transition: 150ms ease-out;
  :deep(path) {
    transition: 150ms ease-out;
  }
}

.options {
  padding: 0 toRem(12) 0.25rem toRem(12);
}

:deep(.auth-link.button-x),
:deep(.kyc-link.button-x) {
  .inner-content {
    transition: 150ms ease-in;
  }
  &:hover {
    .inner-content {
      color: $greenYellow;
    }
  }
}

:deep(.button-logout.button-x) {
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

.link-text {
  font-size: 1rem;
  line-height: leading(35, 18);
}
</style>
