<template>
  <nav id="site-nav">

    <div class="panel-left">
      <!-- ===== logo link -->
      <nuxt-link to="/" class="logo-link">
        <Logo class="logo" />
      </nuxt-link>

      <!-- ===== CTA -->
      <ButtonA
        :to="cta.href"
        tag="button"
        class="site-nav-cta"
        @clicked="$highlightApplyForm">
        <div class="text" v-html="cta.label" />
      </ButtonA>
    </div>

    <!-- ===== links & dropdowns -->
    <div class="links-and-dropdowns">
      <LoginButton />
      <template v-if="account">
        <ProfilePanel toggle-on="click" v-on="$listeners" />
        <NotificationPanel v-on="$listeners" />
      </template>
      <NavigationPanel v-on="$listeners" />
    </div>

  </nav>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Logo from '@/components/logo'
import LoginButton from '@/components/navigation/button-login'
import ProfilePanel from '@/components/navigation/profile-panel'
import NotificationPanel from '@/components/navigation/notification-panel'
import NavigationPanel from '@/components/navigation/navigation-panel'
import ButtonA from '@/components/buttons/button-a'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    Logo,
    LoginButton,
    ProfilePanel,
    NotificationPanel,
    NavigationPanel,
    ButtonA
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      account: 'auth/account'
    }),
    cta () {
      return this.siteContent.general.navigation.cta
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  height: $siteHeaderHeightSmall;
  padding: 0 1rem;
  z-index: 100;
}

.panel-left {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

// ////////////////////////////////////////////////////////////////// Logo & CTA
.logo-link {
  display: block;
  width: 3.5rem;
  margin: 0 1rem;
}

.logo {
  display: block;
  height: 3.5rem;
}

.button.site-nav-cta {
  height: toRem(35);
  .text {
    font-size: toRem(14);
    font-weight: 500;
  }
}

// /////////////////////////////////////////////////////////// Links & Dropdowns
.links-and-dropdowns {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 1rem;
}

.login-button {
  margin-right: 0.5rem;
}

div#notifications {
  margin: 0 0.5rem;
}

:deep(#notifications) {
  .panel-container {
    left: auto;
    right: toRem(-28);
    &:not(.open) {
      transform: translate(0, 1rem);
    }
    &.open {
      transform: translate(0, 0);
    }
  }
  .squiggly {
    left: auto;
    transform: none;
    right: toRem(28);
  }
}

:deep(#navigation-panel) {
  .panel-container {
    left: auto;
    right: -1rem;
    &:not(.open) {
      transform: translate(0, 1rem);
    }
    &.open {
      transform: translate(0, 0);
    }
  }
  .squiggly {
    left: auto;
    transform: none;
    right: 1rem;
  }
}

.button.site-nav-link {
  display: block;
  padding: 0 0.5rem;
  .text {
    font-size: 1rem;
    font-weight: 500;
  }
}

.text {
  font-size: toRem(14);
  font-weight: 500;
}
</style>
