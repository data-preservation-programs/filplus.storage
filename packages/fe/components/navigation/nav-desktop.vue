<template>
  <div :class="['nav-desktop', { minified }]">

    <div class="grid">
      <div class="col">
        <div class="inner-container">

          <!-- ======================================================== logo -->
          <nuxt-link to="/" class="logo-link">
            <Logo class="logo" />
          </nuxt-link>

          <!-- =============================================== nav [desktop] -->
          <nav id="site-nav">

            <!-- ===== [border] top -->
            <div ref="siteNav" class="border-top">
              <div
                :style="{ transform: bloopTransform }"
                :class="['bloop-slider', { 'can-animate': bloopCanNowAnimate }]">
                <svg class="bloop" viewBox="0 0 119 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M118.5 1.41252H96.3169C95.9393 1.41252 95.5626 1.39096 95.1868 1.35434C93.2561 1.16622 86.7888 0.63052 82.5 1.41252C69.7448 3.73823 68.9632 21.6535 56 21.4125C43.3462 21.1773 42.9439 3.71967 30.5 1.41252C26.3958 0.651588 20.2124 1.16646 18.3203 1.35285C17.9385 1.39045 17.5577 1.41252 17.1741 1.41252H0.5" stroke="white" stroke-width="2" />
                </svg>
              </div>
            </div>

            <!-- ===== [border] left -->
            <div class="border-left" />

            <!-- ===== [border] right -->
            <div class="border-right" />

            <!-- ===== nav links -->
            <div
              class="button-list"
              @mouseleave="setBloopDefaultPosition">
              <div
                v-for="(link, index) in links"
                :key="index"
                class="site-nav-link-wrapper"
                @mouseenter="navLinkMouseEnter">
                <ButtonX
                  :to="link.href"
                  :selected="$isRouteCurrent($route, link.href)"
                  :tag="link.type"
                  :target="link.target"
                  class="site-nav-link">
                  <div class="text" v-html="link.label" />
                </ButtonX>
              </div>
            </div>

            <!-- ===== auth -->
            <LoginButton class="login-button" />
            <template v-if="account">
              <ProfilePanel toggle-on="hover" />
              <NotificationPanel />
            </template>

            <!-- ===== marker used to align default bloop position -->
            <div ref="marker" class="marker" />

            <!-- ===== CTA -->
            <ButtonA
              :to="cta.href"
              tag="button"
              class="site-nav-cta"
              @clicked="$highlightApplyForm">
              <div class="text" v-html="cta.label" />
            </ButtonA>

          </nav>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Logo from '@/components/logo'
import ButtonA from '@/components/buttons/button-a'
import ButtonX from '@/components/buttons/button-x'
import ProfilePanel from '@/components/navigation/profile-panel'
import NotificationPanel from '@/components/navigation/notification-panel'
import LoginButton from '@/components/navigation/button-login'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    Logo,
    ButtonA,
    ButtonX,
    ProfilePanel,
    NotificationPanel,
    LoginButton
  },

  data () {
    return {
      minified: false,
      scroll: false,
      resize: false,
      bloopTransform: 'translateX(0%)',
      bloopCanNowAnimate: false, // set to true only after initial load
      modalOpenOnMobile: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      account: 'auth/account'
    }),
    navigationContent () {
      return this.siteContent.general.navigation
    },
    links () {
      return this.navigationContent.header
    },
    cta () {
      return this.navigationContent.cta
    }
  },

  mounted () {
    this.$nextTick(() => {
      // Set up scrollHandler to detect when to make the site nav minified
      const scrollHandler = () => {
        const y = window.pageYOffset || document.documentElement.scrollTop
        const minified = this.minified
        if (y > 0) {
          if (!minified) { this.minified = true }
        } else {
          if (minified) { this.minified = false }
        }
      }; scrollHandler()
      this.scroll = this.$throttle(scrollHandler, 1)
      window.addEventListener('scroll', this.scroll)
      this.resize = this.$throttle(this.setBloopDefaultPosition, 1)
      window.addEventListener('resize', this.resize)
      this.setBloopDefaultPosition()
      // Set the initial position of the bloop
      const timeout = setTimeout(() => {
        this.bloopCanNowAnimate = true
        clearTimeout(timeout)
      }, 150)
    })
  },

  beforeDestroy () {
    if (this.scroll) { window.removeEventListener('scroll', this.scroll) }
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    setBloopDefaultPosition () {
      const rectSiteNav = this.$refs.siteNav.getBoundingClientRect()
      const marker = this.$refs.marker.getBoundingClientRect()
      const offset = marker.left - rectSiteNav.left + (marker.width / 2)
      this.bloopTransform = `translateX(calc(${offset / rectSiteNav.width * 100}% + 3px))`
    },
    navLinkMouseEnter (e) {
      const rectSiteNav = this.$refs.siteNav.getBoundingClientRect()
      const rectLink = e.target.getBoundingClientRect()
      const offset = rectLink.left - rectSiteNav.left + (rectLink.width / 2)
      this.bloopTransform = `translateX(calc(${offset / rectSiteNav.width * 100}% + 3px))`
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.nav-desktop {
  width: 100%;
  height: $siteHeaderHeight;
  transition: 150ms ease-out;
  &.minified {
    transition: 150ms ease-in;
    height: $siteHeaderHeightMinified;
    &:before {
      transition: 150ms ease-in;
      height: 150%;
    }
    #site-nav {
      transition: 150ms ease-in;
      height: 4rem;
    }
  }
}

[class~="grid"], [class*="grid-"], [class*="grid_"] {
  height: 100%;
}

.inner-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
}

// //////////////////////////////////////////////////////////////////////// Logo
.nav-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  .button-list {
    width: 100%;
    height: 100%;
    padding-right: 1rem;
    padding-left: 6rem;
    overflow-x: scroll;
  }
}

.logo-link {
  display: block;
  position: relative;
  height: calc(100% - 2rem);
  z-index: 10000;
  &:focus-visible {
    .logo {
      @include focusOutlineWithOffset;
      border-radius: toRem(5);
    }
  }
  @include medium {
    height: calc(100% - 4rem);
  }
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

.datacap-text-spinner {
  position: relative;
  width: 5.5rem;
}

// ///////////////////////////////////////////////////////////////////////// Nav
#site-nav {
  display: flex;
  align-items: center;
  position: relative;
  height: 5rem;
  padding-left: 1rem;
  border-bottom: 2px solid white;
  transition: 150ms ease-out;
  @include medium {
    padding-left: 0;
  }
  &:hover {
    .border-left {
      transition: 150ms ease-in;
      transform: scaleX(1.5) translateX(-4px);
    }
  }
}

.button-list {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.button.site-nav-link {
  display: block;
  padding: 0 1rem;
  border-radius: toRem(48);
  @include medium {
    padding: 0 0.5rem;
  }
  .text {
    font-size: toRem(18);
    font-weight: 500;
    @include medium {
      font-size: 1rem;
    }
  }
}

.login-button,
#profile {
  margin-left: 1rem;
  @include medium {
    margin-left: 1rem;
  }
}

.button.site-nav-cta {
  height: toRem(35);
  .text {
    font-size: toRem(14);
    font-weight: 500;
  }
}

// ///////////////////////////////////////////////////////////////////// Borders
.border-top,
.border-left,
.border-right {
  pointer-events: none;
}

.border-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

$bloopWidth: 118;

.bloop-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  &.can-animate {
    transition: 300ms ease-in-out;
  }
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    height: 2px;
    background-color: white;
  }
  &:before {
    right: calc(100% + #{toRem(math.div($bloopWidth, 2))} - 1px);
    width: 100vw;
  }
  &:after {
    left: calc(#{toRem(math.div($bloopWidth, 2))} - 1px);
    width: 100vw;
  }
}

.bloop {
  position: absolute;
  top: 0;
  left: toRem(math.div(-$bloopWidth, 2));
  width: toRem($bloopWidth);
  transform: translateY(-0.4px);
}

.border-left,
.border-right {
  position: absolute;
  top: 0;
  height: calc(100% + 2px);
  border-top: 2px solid white;
  border-bottom: 2px solid white;
}

.border-left {
  right: calc(100% + 0.5rem);
  width: 1rem;
  transition: 150ms ease-out;
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: -2px;
    height: 100%;
    border-top: 2px solid white;
    border-bottom: 2px solid white;
  }
  &:before {
    right: calc(100% + 0.25rem); // offset 4px
    width: 0.5rem;
  }
  &:after {
    right: calc(100% + 0.25rem + 0.5rem + 0.25rem); // offset 4px + width of :before + another offset of 4px
    width: 0.25rem;
  }
}

.border-right {
  left: 100%;
  width: calc((100vw - #{$containerWidth}) / 2 + 0.5rem);
  @include containerMaxMQ {
    width: calc(100vw * 0.041665 + 0.5rem);
  }
}

.marker {
  width: 1px;
  height: 100%;
  margin: 0 toRem(math.div(54, 2));
}
</style>
