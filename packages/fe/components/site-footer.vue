<template>
  <footer id="site-footer">

    <Squigglie
      :percent-left="15"
      orientation="down"
      color="nandor"
      :thick="true"
      class="footer-top-border" />

    <section class="section-footer">
      <div class="grid-noGutter-equalHeight">

        <div class="col-3_md-5_mi-12">
          <div class="logo-cta">
            <Logo class="site-logo" />
            <DatacapTextSpinner @clicked="$highlightApplyForm" />
          </div>
        </div>

        <div class="col-4_md-7_mi-12">
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

        <div class="col-5_md-12_mi-12">
          <div class="video-cta-wrapper">
            <ButtonX
              :tag="videoCta.type"
              :to="videoCta.url"
              :target="videoCta.target"
              class="video-cta">

              <Logo class="site-logo" />

              <template v-for="variant in ['small', 'tiny']">
                <Card
                  :key="`footer-card-${variant}`"
                  :variant="variant"
                  corner-position="top-right"
                  icon="chevron-long"
                  :class="['footer-cta-card', `${variant}-variant`]">
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
              </template>

            </ButtonX>
          </div>
        </div>

      </div>

      <Squigglie
        :percent-left="90"
        orientation="up"
        anchor="bottom"
        color="nandor"
        :thick="true"
        class="footer-bottom-border" />

    </section>

    <section class="section-copyright">
      <div class="grid-noGutter">
        <div class="col">
          <div
            v-if="footerContent"
            class="copyright-content">

            <ButtonX
              :to="dataProgramsLogoButton.to"
              :tag="dataProgramsLogoButton.tag"
              :target="dataProgramsLogoButton.target"
              class="link-data-programs-logo">
              <LogoDataPrograms class="logo-data-programs" />
            </ButtonX>

            <div class="secondary-links">
              <ButtonX
                v-for="(item, j) in secondaryLinks"
                :key="`secondary-link-${j}`"
                :to="item.url"
                :tag="item.type"
                :target="item.target"
                class="secondary-link">
                <component
                  :is="getIconComponent(item.icon)"
                  :class="`icon-${item.icon}`" />
              </ButtonX>
            </div>

            <div class="copyright-text" v-html="copyright.text" />

          </div>
        </div>
      </div>
    </section>

  </footer>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Logo from '@/components/logo'
import LogoDataPrograms from '@/components/logo-data-programs'
import DatacapTextSpinner from '@/components/spinners/datacap-text'
import ButtonX from '@/components/buttons/button-x'
import Card from '@/components/card'
import GithubIcon from '@/components/icons/github'
import SlackIcon from '@/components/icons/slack'
import MediumIcon from '@/components/icons/medium'
import Squigglie from '@/components/squigglie'

// ====================================================================== Export
export default {
  name: 'SiteFooter',

  components: {
    Logo,
    LogoDataPrograms,
    DatacapTextSpinner,
    ButtonX,
    Card,
    GithubIcon,
    SlackIcon,
    MediumIcon,
    Squigglie
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    footerContent () {
      return this.siteContent.general ? this.siteContent.general.footer : false
    },
    dataProgramsLogoButton () {
      return this.footerContent.data_programs_logo_button
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
    getIconComponent (type) {
      let icon
      switch (type) {
        case 'github': icon = 'GithubIcon'; break
        case 'slack': icon = 'SlackIcon'; break
        case 'medium': icon = 'MediumIcon'; break
        default: icon = 'div'
      }
      return icon
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-footer {
  position: relative;
  overflow: hidden;
}

.section-footer,
.section-copyright {
  position: relative;
  z-index: 10;
}

.section-footer {
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
}

.footer-bottom-border {
  bottom: 0.5px !important;
  :deep(path) {
    fill: $aztec;
  }
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
    @include mini {
      width: toRem(194);
    }
  }
  @include mini {
    padding: 1.5rem 0;
    height: toRem(350) !important;
  }
}

.datacap-spinner {
  width: 39%;
  right: 1rem;
  top: calc(50% + 1rem);
  cursor: pointer;
  @include mini {
    width: toRem(130);
    right: unset;
    left: calc(50% + 1rem);
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
  @include medium {
    border-right: none;
  }
  @include mini {
    border-left: none;
  }
}

:deep(.primary-link) {
  position: relative;
  padding: toRem(24);
  width: 100%;
  border-bottom: 3px solid $nandor;
  font-weight: 500;
  :deep(.button) {
    @include mini {
      font-size: toRem(18);
    }
  }
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    .button-content {
      transform: scale(1.05);
    }
  }
  @include medium {
    width: calc(100% + 100vw * 0.041665);
  }
  @include mini {
    &:before {
      content: '';
      position: absolute;
      right: 100%;
      top: -7px;
      width: calc(100vw * 0.041665);
      height: 3px;
      background-color: $nandor;
    }
    &:first-child {
      border-top: 3px solid $nandor;
      &:before {
        top: -3px;
      }
    }
  }
}

// /////////////////////////////////////////////////////////////////// Video CTA
.video-cta-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  :deep(.chevron-long){
    transition: 150ms ease-in;
  }
  &:hover {
    :deep(.chevron-long) {
      transition: 150ms ease-in;
      transform: translateX(1rem);
    }
  }
  @include medium {
    height: toRem(314) !important;
  }
  @include tiny {
    height: toRem(250) !important;
  }
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
    @include medium {
      width: toRem(1024);
      height: calc(100% - 2px);
      left: 50%;
      transform: translateX(-50%);
      border-right: none;
      border-top: 3px solid $nandor;
      max-width: unset;
      background-position: center;
    }
    @include mini {
      width: toRem(640);
    }
    @include tiny {
      width: toRem(415);
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

.footer-cta-card.corner-position__top-right {
  position: absolute;
  width: fit-content;
  left: 2.1875rem;
  bottom: 1.125rem;
  transform-origin: bottom left;
  transition: 150ms ease-out;
  :deep(.content) {
    display: flex;
    justify-content: space-between;
    padding: 1.375rem 2.6875rem 1.4375rem 1.5rem;
    @include mini {
      padding: 0.875rem;
      padding-right: 1.75rem;
    }
  }
  :deep(.icon) {
    background-color: #0047FF;
  }
  &.small-variant {
    @include mini {
      display: none;
    }
  }
  &.tiny-variant {
    display: none;
    @include mini {
      display: block;
    }
  }
  .card-image {
    margin: auto 0;
    width: toRem(57);
    height: toRem(57);
    border-radius: 50%;
    @include mini {
      width: toRem(34);
      height: toRem(34);
    }
  }
  .card-text {
    margin-left: 1.375rem;
    font-size: toRem(25);
    font-weight: 500;
    line-height: 1.3;
    @include mini {
      font-size: toRem(15);
      margin-left: 0.875rem;
    }
  }
}

// /////////////////////////////////////////////////////////// Copyright Section
.copyright-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: toRem(80);
  @include medium {
    height: unset;
    flex-direction: column;
    align-items: flex-start;
    margin-top: toRem(45);
    margin-bottom: 4.1665vw;
    :deep(br) {
      display: none;
    }
  }
}

.logo-data-programs {
  width: toRem(162);
  @include medium {
    margin-bottom: 2rem;
  }
}

.secondary-links {
  display: flex;
  align-items: center;
}

.link-data-programs-logo {
  transition: 150ms ease-out;
  &:hover {
    transition: 150ms ease-in;
    transform: scale(1.05);
  }
}

.secondary-link {
  padding: 0;
  border-bottom: none;
  transition: 150ms ease-out;
  &:hover {
    transition: 150ms ease-in;
    transform: scale(1.2);
  }
  &:not(:last-child) {
    margin-right: 1.5625rem;
  }
}

.icon-slack,
.icon-github {
  display: block;
  width: 1.875rem;
}

.icon-medium {
  display: block;
  width: toRem(44);
}

.copyright-text {
  padding-left: 1rem;
  font-size: toRem(14);
  font-weight: 400;
  line-height: leading(24, 15);
  color: $juniper;
  text-align: right;
  @include medium {
    margin-top: 2rem;
    padding-left: 0;
    text-align: left;
  }
  :deep(a) {
    @include linkUnderline;
  }
}
</style>
