<template>
  <header
    id="site-header"
    ref="header"
    :class="{ mini }">

    <div class="grid-noGutter">
      <div class="col">
        <div class="inner-container">

          <!-- ======================================================== Logo -->
          <nuxt-link
            to="/"
            class="logo-link"
            @click.native="closeNav">
            <Logo class="logo" />
          </nuxt-link>

          <div
            v-if="breakpoint !== 'medium'"
            :class="['nav-wrapper', breakpoint]"
            :style="{
              width: `${navWidth}px`,
              '--squiggle-container-length': `${squiggleContainerLength}px`,
              '--right-squiggle-offset': `${navWidth - squiggleContainerLength}px`,
            }">

            <div class="nav-detail" />

            <!-- ================================================ Squigglies -->
            <div class="squiggle-container">
              <div
                :class="['svg-wrapper', 'animated', breakpoint]"
                :style="{ transform: `translateX(${squiggleOffsetLeft - squiggleDefaultOffset}px)` }">
                <svg
                  class="squiggle"
                  width="1860"
                  height="40"
                  viewBox="0 0 1858 40"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    :key="pathKey"
                    :d="path"
                    stroke="white"
                    stroke-width="2" />
                </svg>
              </div>
              <div
                class="svg-wrapper static"
                :style="{ '--bottom-squiggle-offset': `${bottomSquiggleOffset}px` }">
                <svg
                  class="squiggle"
                  width="1860"
                  height="40"
                  viewBox="0 0 1858 40"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    :d="path"
                    stroke="white"
                    stroke-width="2" />
                </svg>
              </div>
            </div>

            <nav id="site-nav">
              <!-- =============================================== Nav links -->
              <div
                ref="buttonList"
                class="button-list"
                @mouseleave.self="mouseLeaveNav">
                <ButtonX
                  v-for="(link, index) in links"
                  :key="index"
                  ref="navItems"
                  :to="link.href"
                  :selected="$isRouteCurrent($route, link.href)"
                  :tag="link.type"
                  :target="link.target"
                  class="site-nav-link"
                  @mouseover.native="mouseOverLink(index)">
                  <div class="text" v-html="link.label" />
                </ButtonX>
                <AuthButton />
                <ButtonA
                  v-if="cta"
                  :to="cta.href"
                  tag="button"
                  class="site-nav-cta"
                  @clicked="$highlightApplyForm">
                  <div class="text" v-html="cta.label" />
                </ButtonA>
              </div>

            </nav>

          </div>

          <!-- ================================================== Mobile nav -->
          <MobileNav
            v-else
            ref="mobileNav"
            :links="links"
            :cta="cta" />

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
import MobileNav from '@/components/mobile-nav'
import AuthButton from '@/components/auth-button'

// =================================================================== Functions
const resizeHandler = (instance) => {
  instance.squiggleOffsetLeft = 0
  if (window.matchMedia('(max-width: 64rem)').matches) {
    if (instance.breakpoint !== 'medium') {
      instance.breakpoint = 'medium'
    }
  } else if (window.matchMedia('(max-width: 75rem)').matches) {
    if (instance.breakpoint !== 'large') {
      instance.breakpoint = 'large'
    }
  } else if (window.matchMedia('(max-width: 90rem)').matches) {
    if (instance.breakpoint !== 'xlarge') {
      instance.breakpoint = 'xlarge'
    }
  } else {
    if (instance.breakpoint !== 'default') {
      instance.breakpoint = 'default'
    }
  }
  if (instance.$refs.buttonList) {
    const children = instance.$refs.buttonList.children
    const lastButton = children[children.length - 1]
    const offset = lastButton.offsetLeft - instance.navWidth
    const offXlarge = instance.breakpoint === 'xlarge' ? 28 : instance.breakpoint === 'large' ? 24 : 0
    instance.bottomSquiggleOffset = offset - offXlarge
    instance.squiggleContainerLength = lastButton.offsetLeft + lastButton.clientWidth
  }
}

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    Logo,
    ButtonA,
    ButtonX,
    MobileNav,
    AuthButton
  },

  data () {
    return {
      mini: false,
      scroll: false,
      resize: false,
      squiggleWidth: 80,
      squiggleOffsetLeft: 0,
      pathKey: 0,
      path: 'M 0 2 H 892 C 893 2 893 2 893 2 C 895 2 901 1 906 2 C 918 4 918 22 931 22 C 944 22 945 4 958 2 C 962 1 968 2 970 2 C 971 2 971 2 971 2 H 1862',
      breakpoint: 'default',
      bottomSquiggleOffset: -182,
      squiggleContainerLength: 0
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      account: 'auth/account'
    }),
    navWidth () {
      if (this.breakpoint !== 'default') {
        return this.breakpoint === 'xlarge' ? 930 : 760
      }
      return 960
    },
    squiggleDefaultOffset () {
      return this.breakpoint === 'large' ? 532 : 436
    },
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

  watch: {
    squiggleOffsetLeft () {
      this.pathKey++
    },
    account () {
      this.$nextTick(() => {
        setTimeout(() => {
          resizeHandler(this)
        }, 100)
      })
    }
  },

  mounted () {
    this.$nextTick(() => {
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
      resizeHandler(this)
      this.resize = this.$throttle(() => { resizeHandler(this) }, 1)
      window.addEventListener('resize', this.resize)
    })
  },

  beforeDestroy () {
    if (this.scroll) { window.removeEventListener('scroll', this.scroll) }
  },

  methods: {
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
    },
    closeNav () {
      const mobileNav = this.$refs.mobileNav
      if (mobileNav && mobileNav.modal) {
        mobileNav.toggleModal()
      }
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
.nav-wrapper {
  --squiggle-container-length: 100%;
  --right-squiggle-offset: 0px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: toRem(82);
  width: toRem(828);
  &:before {
    content: '';
    position: absolute;
    right: var(--right-squiggle-offset);
    top: 1px;
    transform: translateX(calc(100% - 0.5rem));
    width: 129px;
    height: calc(100% - 4px);
    border-bottom: solid 2px white;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='129' height='24' viewBox='0 0 129 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M 0 1.0005 H -0.826 C 2.212 0.7544 8.396 0.2395 12.5 1.0005 C 24.944 3.3076 25.346 20.7652 38 21.0005 C 50.963 21.2415 51.745 3.3262 64.5 1.0005 C 68.789 0.2185 75.256 0.7542 77.187 0.9423 C 77.563 0.9789 77.939 1.0005 78.317 1.0005 H 129' stroke='white' stroke-width='2'/%3e%3c/svg%3e ");
    @include large {
      display: none;
    }
  }
  .squiggle-container {
    width: var(--squiggle-container-length);
    @include large {
      width: calc(100% + 20rem);
    }
  }
}

#site-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding-right: toRem(46);
}

.button-list {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 2rem;
  @include large {
    padding-left: 0.25rem;
  }
}

.site-nav-link {
  font-size: toRem(18);
  &:not(:last-child) {
    margin-right: 3.125rem;
  }
  @include large {
    font-size: 1rem;
    &:not(:last-child) {
      margin-right: 2rem;
    }
    :deep(.button-content) {
      font-size: 1rem;
    }
  }
}

.logo-link {
  position: relative;
  z-index: 10000;
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

:deep(.auth-button) {
  .button {
    @include large {
      padding: 0.625rem 1rem;
    }
  }
}

.button.site-nav-cta {
  padding: 0.375rem 1.5rem;
  margin-left: 3.125rem;
  @include large {
    padding: 0.25rem 1.25rem;
    margin-left: 2rem;
    :deep(.button-content) {
      font-size: 0.9375rem;
    }
  }
}

// /////////////////////////////////////////////////////////////// Nav Detailing
$squiggleAnimationDuration: 500ms;

@keyframes wave {
  0%, 100%{
    d:path('M 0 2 H 892 C 893 2 893 2 893 2 C 895 2 901 1 906 2 C 918 4 918 22 931 22 C 944 22 945 4 958 2 C 962 1 968 2 970 2 C 971 2 971 2 971 2 H 1862');
  }
  50%{
    d:path('M 0 2 H 892 C 893 2 893 2 893 2 C 895 2 901 2 906 4 C 918 8 918 17 931 17 C 944 17 946 6 958 3 C 962 2 968 2 970 2 C 971 2 971 2 971 2 H 1862')
  }
}

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
  max-width: toRem(904);
  height: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
  @include containerMaxMQ {
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
    --bottom-squiggle-offset: -128px;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: scaleY(-1) translateX(var(--bottom-squiggle-offset));
  }
}
</style>
