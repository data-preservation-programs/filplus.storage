<template>
  <footer id="site-footer">

    <Overlay type="noise" />

    <section class="section-footer">
      <div class="grid-noGutter-equalHeight">

        <div class="col-3">
          <div class="logo-cta">
            <Logo class="site-logo" />
            <div class="cta-wrapper">
              <CircleText class="cta-spinner" />
              <Arrow class="cta-arrow" />
            </div>
          </div>
        </div>

        <div class="col-4">
          <div class="footer-nav">
            <ButtonX
              v-for="(link, i) in primaryLinks"
              :key="`primary-link-${i}`"
              :tag="link.type"
              :to="link.href"
              :target="link.target"
              :disabled="link.disabled"
              class="primary-link">
              {{ link.label }}
            </ButtonX>
          </div>
        </div>

        <div class="col-5">
          <div class="video-cta-wrapper">
            <nuxt-link to="/" class="video-cta">

              <Logo class="site-logo" />

              <Card
                corner-position="top-right"
                :small="true"
                icon="chevron"
                class="footer-cta-card">
                <template v-if="videoCta">

                  <img
                    class="card-image"
                    :src="videoCta.image" />

                  <div
                    class="card-text"
                    v-html="videoCta.text">
                  </div>

                </template>
              </Card>

            </nuxt-link>
          </div>
        </div>

      </div>
    </section>

    <section class="section-copyright">
      <div class="grid-noGutter">
        <div class="col">
          <div
            v-if="footerContent"
            class="copyright-content">

            <div class="secondary-links">
              <ButtonX
                v-for="(item, j) in secondaryLinks"
                :key="`secondary-link-${j}`"
                tag="a"
                :to="item.url"
                target="_blank">

                <component :is="getIconComponent(item.icon)" />

              </ButtonX>
            </div>

            <div class="copyright-text">
              {{ copyright.text }}
            </div>

          </div>
        </div>
      </div>
    </section>

  </footer>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Overlay from '@/components/overlay'
import Logo from '@/components/logo'
import CircleText from '@/components/icons/circle-text'
import Arrow from '@/components/icons/arrow'
import ButtonX from '@/components/buttons/button-x'
import Card from '@/components/card'
import GithubIcon from '@/components/icons/github'
import SlackIcon from '@/components/icons/slack'

// ====================================================================== Export
export default {
  name: 'SiteFooter',

  components: {
    Overlay,
    Logo,
    CircleText,
    Arrow,
    ButtonX,
    Card,
    GithubIcon,
    SlackIcon
    // ButtonD
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    footerContent () {
      return this.siteContent.general ? this.siteContent.general.footer : false
    },
    primaryLinks () {
      if (this.footerContent) { return this.footerContent.links }
      return []
    },
    videoCta () {
      if (this.footerContent) { return this.footerContent.video_cta }
      return false
    },
    copyright () {
      return this.footerContent.copyright
    },
    secondaryLinks () {
      return this.copyright.links
    }
  },

  methods: {
    isRouteCurrent (href) {
      const route = this.$route
      if (route.path === href) { return true }
      return false
    },
    getIconComponent (icon) {
      switch (icon) {
        case 'github':
          return 'GithubIcon'
        case 'slack':
          return 'SlackIcon'
      }
      return 'div'
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-footer {
  overflow: hidden;
}

.section-footer {
  position: relative;
  border-top: 3px solid $nandor;
  border-bottom: 3px solid $nandor;
}

.site-logo {
  position: absolute;
}

// //////////////////////////////////////////////////////////////////// Logo CTA
.logo-cta {
  position: relative;
  .site-logo {
    width: 58%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.cta-wrapper {
  position: absolute;
  width: 39%;
  right: 1rem;
  top: calc(50% + 1rem);
}

.cta-spinner {
  position: relative;
  width: 100%;
  animation: spinning 15s infinite linear reverse;
}

.cta-arrow {
  position: absolute;
  top: calc(50% - 4px);
  left: calc(50% + 1px);
  transform: translate(-50%, -50%);
}

@keyframes spinning {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
// ///////////////////////////////////////////////////////////////////////// Nav
.footer-nav {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  margin-bottom: 0.75rem;
  border-left: 3px solid $nandor;
  border-right: 3px solid $nandor;
}

:deep(.button-x) {
  padding: toRem(38) toRem(40);
  width: 100%;
  border-bottom: 3px solid $nandor;
  &:last-child {
    border-bottom: none;
  }
}

// /////////////////////////////////////////////////////////////////// Video CTA
.video-cta-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: calc(100% + (50vw - #{math.div($containerWidth, 2)}) + 3px);
    max-width: toRem(623);
    border-right: 3px solid $nandor;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: left calc(50% + 2rem) top 50%;
    background-image: url('~/assets/images/abstract-3d-object-with-three-layered-branches-and-rounded-edges.png');
    @include containerMaxMQ {
      width: calc(100% + 100vw * 0.041665 + 3px);
    }
  }
}

.video-cta {
  display: block;
  width: 100%;
  height: 100%;
  .site-logo {
    width: 13%;
    top: 1.75rem;
    left: 1.75rem;
  }
}

.footer-cta-card {
  position: absolute;
  width: 63%;
  left: 2.1875rem;
  bottom: 1.125rem;
  :deep(.content) {
    display: flex;
    justify-content: space-between;
    padding: 1.375rem 2.6875rem 1.4375rem 1.5rem;
  }
  :deep(.icon) {
    background-color: #0047FF;
    path {
      stroke: white;
    }
  }
  .card-image {
    margin: auto 0;
    width: toRem(57);
    height: toRem(57);
    border-radius: 50%;
  }
  .card-text {
    font-size: toRem(25);
    font-weight: 500;
    line-height: 1.3;
  }
}

// /////////////////////////////////////////////////////////// Copyright Section
.copyright-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: toRem(80);
}

.copyright-text {
  font-size: 1rem;
  font-weight: 400;
  line-height: leading(30, 16);
  color: #75938B;
}

.secondary-links {
  display: flex;
  align-items: center;
  :deep(.button-x) {
    padding: 0;
    margin-right: 1.5625rem;
    height: 1.875rem;
    border-bottom: none;
  }
}
</style>
