<template>
  <header
    v-if="links"
    id="site-header"
    ref="header"
    :class="{ mini }">

    <div class="grid-noGutter">
      <div class="col">
        <div class="inner-container">

          <!-- ======================================================== Logo -->
          <nuxt-link to="/" class="logo-link">
            <Logo class="logo" />
          </nuxt-link>

          <nav id="site-nav">
            <!-- ================================================= Nav links -->
            <div class="button-list">
              <ButtonX
                v-for="(link, index) in links"
                :key="index"
                :to="link.href"
                :selected="isRouteCurrent(link.href)"
                tag="nuxt-link"
                class="site-nav-link">
                {{ link.label }}
              </ButtonX>
            </div>
            <!-- =============================================== Squigglies? -->
          </nav>

        </div>
      </div>
    </div>

  </header>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Logo from '@/components/logo'
import ButtonX from '@/components/buttons/button-x'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    Logo,
    ButtonX
  },

  data () {
    return {
      mini: false,
      scroll: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    links () {
      const siteContent = this.siteContent
      return siteContent.general ? siteContent.general.navigation.header : false
    }
  },

  mounted () {
    const scrollHandler = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop
      const mini = this.mini
      if (y > 0) {
        if (!mini) { this.mini = true }
      } else {
        if (mini) { this.mini = false }
      }
    }; scrollHandler()
    this.scroll = this.$throttle(scrollHandler, 1)
    window.addEventListener('scroll', this.scroll)
  },

  beforeDestroy () {
    if (this.scroll) { window.removeEventListener('scroll', this.scroll) }
  },

  methods: {
    isRouteCurrent (href) {
      const route = this.$route
      if (route.path === href) { return true }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $siteHeaderHeight;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 28.86%, transparent 100%);
  z-index: 1000;
  transition: background-color 150ms ease-out, height 150ms ease-out;
  &.mini {
    transition: background-color 150ms ease-in, height 150ms ease-in;
    height: $siteHeaderHeightMini;
    @include mini {
      height: $siteHeaderHeight;
    }
  }
}

[class~="grid"],
[class*="grid-"],
[class*="grid_"] {
  height: 100%;
}

.inner-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;;
  align-items: center;
  width: 100%;
  height: 100%;
  @include small {
    flex-wrap: wrap;
    padding: 1rem 0;
  }
}

// ////////////////////////////////////////////////////////////////// Navigation
#site-nav {
  position: relative;
}

.button-list {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.site-nav-link {
  &:not(:last-child) {
    margin-right: 3.125rem;
  }
}

.logo-link {
  display: block;
  height: 71.4%;
}

.logo {
  display: block;
  height: 100%;
  transition: 150ms ease-out;
  &:hover {
    transition: 150ms ease-in;
    transform: scale(1.05);
  }
}
</style>
