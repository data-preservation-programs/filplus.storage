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

          <div class="nav-wrapper">

            <div class="nav-detail"></div>
            <!-- ================================================ Squigglies -->
            <div class="squiggle-container">
              <div
                class="svg-wrapper animated"
                :style="{ transform: `translateX(${squiggleOffsetLeft - squiggleDefaultOffset}px)` }">
                <svg
                  class="squiggle"
                  width="1860"
                  height="40"
                  viewBox="0 0 1858 40"
                  xmlns="http://www.w3.org/2000/svg">
                  <path :key="pathKey" stroke="white" stroke-width="2" />
                </svg>
              </div>
              <div class="svg-wrapper static">
                <svg
                  class="squiggle"
                  width="1860"
                  height="40"
                  viewBox="0 0 1858 40"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke="white" stroke-width="2" />
                </svg>
              </div>
            </div>

            <nav id="site-nav">
              <!-- =============================================== Nav links -->
              <div
                class="button-list"
                @mouseleave.self="mouseLeaveNav">
                <ButtonX
                  v-for="(link, index) in links"
                  :key="index"
                  ref="navItems"
                  :to="link.href"
                  :selected="isRouteCurrent(link.href)"
                  tag="nuxt-link"
                  class="site-nav-link"
                  @mouseover.native="mouseOverLink(index)">
                  {{ link.label }}
                </ButtonX>
              </div>

              <ButtonA
                v-if="cta"
                :to="cta.href"
                tag="nuxt-link"
                class="site-nav-cta">
                {{ cta.label }}
              </ButtonA>

            </nav>

          </div>

        </div>
      </div>
    </div>

  </header>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Logo from '@/components/logo'
import ButtonA from '@/components/buttons/button-a'
import ButtonX from '@/components/buttons/button-x'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    Logo,
    ButtonA,
    ButtonX
  },

  data () {
    return {
      mini: false,
      scroll: false,
      squiggleWidth: 80,
      squiggleDefaultOffset: 308,
      squiggleOffsetLeft: 0,
      pathKey: 0,
      navWidth: 828
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    links () {
      const siteContent = this.siteContent
      return siteContent.general ? siteContent.general.navigation.header : false
    },
    cta () {
      const siteContent = this.siteContent
      return siteContent.general ? siteContent.general.navigation.cta : false
    }
  },

  watch: {
    squiggleOffsetLeft () {
      this.pathKey++
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
    },
    mouseOverLink (index) {
      if (this.$refs.navItems) {
        const element = this.$refs.navItems[index].$el
        const elemCenter = element.offsetLeft + (element.clientWidth / 2)
        // svgScalar is needed to account for the difference between the
        // length of the flat portion of the svg and the nav length
        const svgScalar = 892 - this.navWidth
        this.squiggleOffsetLeft = elemCenter - this.navWidth + this.squiggleDefaultOffset - (this.squiggleWidth / 2) - svgScalar
      }
    },
    mouseLeaveNav () {
      this.squiggleOffsetLeft = 0
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
$navWidth: toRem(828);
.nav-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: toRem(82);
  width: $navWidth;
  @include large {
    // padding-right: calc(100vw * 0.041665);
    // transform: translateX(calc(100vw * 0.041665));
  }
}

#site-nav {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding-right: toRem(46);
}

.button-list {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: toRem(80);
}

.site-nav-link {
  font-size: toRem(18);
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
// /////////////////////////////////////////////////////////////// Nav Detailing
$squiggleAnimationDuration: 500ms;

.nav-detail {
  position: absolute;
  left: -1.25rem;
  top: 1px;
  width: 1rem;
  height: calc(100% - 2px);
  border-top: 2px solid white;
  border-bottom: 2px solid white;
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: -2px;
    height: 100%;
    border: inherit;
  }
  &:before {
    width: 0.5rem;
    left: -0.75rem;
  }
  &:after {
    width: 0.25rem;
    left: -1.25rem;
  }
}

.squiggle-container {
  position: absolute;
  width: calc(100% + 50vw - #{math.div($containerWidth, 2)});
  max-width: toRem(940);
  height: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
  @include large {
    width: calc(100% + 100vw * 0.041665);
  }
}

.squiggle {
  position: absolute;
  left: 0;
  top: 0;
  fill: none;
  path {
    d:path('M 0 2 H 892 C 893 2 893 2 893 2 C 895 2 901 1 906 2 C 918 4 918 22 931 22 C 944 22 945 4 958 2 C 962 1 968 2 970 2 C 971 2 971 2 971 2 H 1862');
  }
}

.svg-wrapper {
  &.animated {
    transition: $squiggleAnimationDuration cubic-bezier(0.43, 0.14, 0.38, 1.29);
    .squiggle {
      path {
        animation: wave $squiggleAnimationDuration 1;
      }
    }
  }
  &.static {
    position: absolute;
    left: 0;
    bottom: 0;
    transform: scaleY(-1) translateX(-128px);
  }
}

@keyframes wave {
  0%, 100%{
    d:path('M 0 2 H 892 C 893 2 893 2 893 2 C 895 2 901 1 906 2 C 918 4 918 22 931 22 C 944 22 945 4 958 2 C 962 1 968 2 970 2 C 971 2 971 2 971 2 H 1862');
  }
  50%{
    d:path('M 0 2 H 892 C 893 2 893 2 893 2 C 895 2 901 2 906 4 C 918 8 918 17 931 17 C 944 17 946 6 958 3 C 962 2 968 2 970 2 C 971 2 971 2 971 2 H 1862')
  }
}

</style>
