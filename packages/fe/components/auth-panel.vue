<template>
  <div class="auth-panel">

    <!-- ====================================================== Login button -->
    <Login v-if="!account" v-slot="{ loginWith }">
      <ButtonB
        class="login-button"
        loader="login-button"
        @clicked="loginWith('github')">
        <IconGithub class="icon-github" />
        <span>Login</span>
      </ButtonB>
    </Login>

    <template v-else>
      <ProfilePanel />
      <NotificationPanel />
    </template>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import ButtonB from '@/components/buttons/button-b'
import Login from '@/modules/auth/components/login'
import ProfilePanel from '@/components/profile-panel'
import NotificationPanel from '@/components/notification-panel'

import IconGithub from '@/components/icons/github'

// ====================================================================== Export
export default {
  name: 'AuthPanel',

  components: {
    Login,
    ButtonB,
    ProfilePanel,
    NotificationPanel,
    IconGithub
  },

  computed: {
    ...mapGetters({
      account: 'auth/account'
    })
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.auth-panel {
  display: flex;
  flex-direction: row;
  align-items: center;
}

// ////////////////////////////////////////////////////////////// [Button] login
.login-button {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  height: toRem(35);
  padding: 0 1rem;
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
  :deep(.button-content) {
    font-size: toRem(14);
    font-weight: 500;
  }
}

.icon-github {
  width: 1rem;
  margin-right: 0.5rem;
  :deep(path) {
    fill: $greenYellow;
    transition: 150ms ease-out;
  }
}
</style>
