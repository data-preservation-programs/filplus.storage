<template>
  <div class="auth-button">

    <Login v-if="!account" v-slot="{ loginWith }">
      <ButtonB
        class="login-button"
        loader="login-button"
        @clicked="loginWith('github')">
        <IconGithub class="icon-github" />
        <span>Login / Register</span>
      </ButtonB>
    </Login>

    <Logout v-else v-slot="{ logout }">
      <ButtonB
        class="logout-button"
        loader="logout-button"
        @clicked="logout">
        <IconShutdown class="icon-shutdown" />
        <span>Logout</span>
      </ButtonB>
    </Logout>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import ButtonB from '@/components/buttons/button-b'
import Login from '@/modules/auth/components/login'
import Logout from '@/modules/auth/components/logout'

import IconGithub from '@/components/icons/github'
import IconShutdown from '@/components/icons/shutdown'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    Login,
    Logout,
    ButtonB,
    IconGithub,
    IconShutdown
  },

  computed: {
    ...mapGetters({
      account: 'account/account'
    })
  }
}
</script>

<style lang="scss" scoped>
// ////////////////////////////////////////////////////////////// Authentication
.login-button {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
}

.login-button,
.logout-button {
  &:not([disabled]) {
    &:hover {
      color: $aztec;
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

.icon-github,
.icon-shutdown {
  width: 1rem;
  margin-right: 0.75rem;
  :deep(path) {
    fill: $greenYellow;
    transition: 150ms ease-out;
  }
}
</style>
