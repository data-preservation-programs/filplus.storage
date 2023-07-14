<template>
  <div id="site-header" :class="{ 'mobile-dropdown-open': mobileDropdownOpen }">

    <NavDesktop class="desktop-only" />

    <NavMobile
      class="mobile-only"
      @dropdownPanelToggled="dropdownPanelToggled" />

    <div class="underlay mobile-only">
      <Overlay type="noise" />
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import NavDesktop from '@/components/navigation/nav-desktop'
import NavMobile from '@/components/navigation/nav-mobile'
import Overlay from '@/components/overlay'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    NavDesktop,
    NavMobile,
    Overlay
  },

  data () {
    return {
      mobileDropdownOpen: false,
      timeout: null
    }
  },

  computed: {
    ...mapGetters({
      account: 'auth/account'
    })
  },

  watch: {
    async account (account) {
      if (account) {
        await this.getNotificationList()
        this.getNewNotificationCount()
      }
    }
  },

  methods: {
    ...mapActions({
      getNotificationList: 'notifications/getNotificationList',
      getNewNotificationCount: 'notifications/getNewNotificationCount'
    }),
    dropdownPanelToggled (payload) {
      console.log(payload.state)
      if (!this.timeout) {
        this.timeout = setTimeout(() => {
          this.mobileDropdownOpen = payload.state
          this.timeout = null
        }, 100)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.mobile-only) {
  @include customMinMQ (53.1875rem) {
    display: none !important;
  }
}

:deep(.desktop-only) {
  @include small {
    display: none !important;
  }
}

#site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: 150ms ease-out;
  &:before {

  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 125%;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 20%, transparent 100%);
    pointer-events: none;
    z-index: -1;
    transition: 150ms ease-out;
  }
  &.mobile-dropdown-open {
    .underlay {
      transition: 150ms ease-in;
      opacity: 1;
    }
  }
}

.underlay {
  position: absolute;
  top: -1rem;
  left: -1rem;
  width: calc(100vw + 2rem);
  height: calc(100vh + 2rem);
  backdrop-filter: blur(10px);
  opacity: 0;
  pointer-events: none;
  transition: 150ms ease-out;
  @include customMinMQ (53.1875rem) {
    display: none;
  }
}
</style>
