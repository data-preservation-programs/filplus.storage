<template>
  <nav id="site-nav">

    <!-- ===== logo link -->
    <nuxt-link to="/" class="logo-link">
      <Logo class="logo" />
    </nuxt-link>

    <!-- ===== links & dropdowns -->
    <div class="links-and-dropdowns">
      <LoginButton />
      <template v-if="account">
        <ProfilePanel toggle-on="click" v-on="$listeners" />
        <NotificationPanel v-on="$listeners" />
      </template>
      <NavigationPanel v-on="$listeners" />
    </div>

    <!-- ===== CTA -->
    <ButtonA
      :to="cta.href"
      tag="button"
      class="site-nav-cta"
      @clicked="$highlightApplyForm">
      <div class="text" v-html="cta.label" />
    </ButtonA>

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

.logo-link {
  display: block;
  width: 4rem;
  margin-right: 0.5rem;
}

.logo {
  display: block;
  height: 4rem;
}

.links-and-dropdowns {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.login-button {
  margin-right: 0.5rem;
}

div#notifications {
  margin: 0 0.5rem;
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
