<template>
  <div :class="`page page-${tag}`">

    <!-- ============================================================== Hero -->
    <HeroA
      :heading="heading"
      heading-cols="col-12"
      content-direction="horizontal"
      background-image="block-backsplash.jpg" />

    <!-- =============================================================== FAQ -->
    <div id="section-content">

      <Squigglie
        :percent-left="6"
        orientation="down"
        color="nandor"
        :thick="true"
        class="section-top-border" />

      <div class="grid-spaceBetween">

        <div class="col-7_lg-8_sm-9_mi-10" data-push-left="off-1_mi-0">

          <MarkdownParser :markdown="markdown" />

          <KycButton
            v-if="account"
            :go-to-togggle="true"
            theme="full"
            class="kyc-link" />

          <LoginButton />

          <div class="partner-text">
            {{ partnerText }}
            <LogoTogggle />
          </div>

        </div>

        <div class="col-4_lg-3_sm-2_mi-1">
          <div class="panel-right">
            <div class="warp-image-double" />
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================================== Overlays -->
    <Overlay type="noise" />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import HeroA from '@/components/hero-a'
import MarkdownParser from '@/components/markdown-parser'
import Overlay from '@/components/overlay'
import Squigglie from '@/components/squigglie'
import KycButton from '@/components/kyc-button'
import LogoTogggle from '@/components/logo-togggle'
import LoginButton from '@/components/navigation/button-login'

import KycPageData from '@/content/pages/kyc.json'
import KycContent from '@/content/markdown/kyc.md'

// ====================================================================== Export
export default {
  name: 'KycPage',

  components: {
    HeroA,
    MarkdownParser,
    Overlay,
    Squigglie,
    KycButton,
    LogoTogggle,
    LoginButton
  },

  data () {
    return {
      tag: 'about'
    }
  },

  async fetch ({ app, store }) {
    await store.dispatch('general/getBaseData', { key: 'about', data: KycPageData })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      account: 'auth/account'
    }),
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    heading () {
      return this.pageData.heading
    },
    partnerText () {
      return this.pageData.partner_text
    },
    markdown () {
      return KycContent
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-about {
  overflow: hidden;
}

.overlay.type__noise {
  z-index: 5;
}

// //////////////////////////////////////////////////////////////////////// Hero
::v-deep #hero {
  .heading {
    @include medium {
      flex-direction: column;
    }
  }
  .bubble {
    margin-left: 1.25rem;
    @include medium {
      margin-left: 0;
      margin-top: 1.25rem;
    }
    @include mini {
      margin-top: 0.75rem;
      padding: 0.75rem 1.5rem;
    }
  }
  .overlay.type__opaque {
    background-color: rgba(15, 31, 26, 0.9);
  }
}

:deep(.hero-content) {
  @include mini {
    padding-bottom: 7rem;
  }
}

// //////////////////////////////////////////////////////////////////////// Body
#section-content {
  position: relative;
  padding-bottom: 7.3125rem;
  z-index: 10;
}

.markdown {
  padding-top: 9rem;
  padding-right: 5rem;
  @include small {
    padding-right: 3rem;
  }
  @include mini {
    padding-right: 0;
  }
}

.kyc-link,
.login-button {
  margin-top: 5rem;
}

:deep(.kyc-link) {
  display: inline-block;
  .kyc-button {
    &.unverified {
      + .tooltip-content-wrapper {
        display: none;
      }
    }
  }
}

.partner-text {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 2.5rem;
  font-weight: 500;
  color: $juniper;
  svg {
    margin-left: toRem(7);
  }
}

// ////////////////////////////////////////////////////////////////// Warp Image
.panel-right {
  position: relative;
  height: 100%;
}

.warp-image-double {
  position: absolute;
  top: 3px;
  left: 0;
  width: 69rem;
  height: 500rem;
  background-image: url('~assets/images/warp-image-double.png');
  background-position: top left;
  background-size: 69rem;
}
</style>
