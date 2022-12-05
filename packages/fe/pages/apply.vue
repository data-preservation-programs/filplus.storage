<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroA />

    <!-- =============================================================== FAQ -->
    <div id="section-faq">
      <div class="grid-spaceBetween">

        <div class="col-6" data-push-left="off-1">
          <h2 class="faq-heading" v-html="faqHeading" />
          <div class="section-accordion">
            <FaqAccordion
              :entries="faqList"
              :toggle-button-content="accordionToggleButtonText" />
            <ButtonA
              :to="moreButton.href"
              :tag="moreButton.type"
              class="more-button">
              {{ moreButton.label }}
            </ButtonA>
          </div>
        </div>

        <div class="col-4">
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
import FaqAccordion from '@/components/faq-accordion'
import ButtonA from '@/components/buttons/button-a'
import Overlay from '@/components/overlay'

import ApplyPageData from '@/content/pages/apply.json'
import FaqPageData from '@/content/pages/faq.json'

// ====================================================================== Export
export default {
  name: 'ApplyPage',

  components: {
    ButtonA,
    HeroA,
    FaqAccordion,
    Overlay
  },

  data () {
    return {
      tag: 'apply'
    }
  },

  async fetch ({ store, route }) {
    await store.dispatch('general/getBaseData', { key: 'apply', data: ApplyPageData })
    await store.dispatch('general/getBaseData', { key: 'faq', data: FaqPageData })
    const application = store.getters['general/application']
    await store.dispatch('form/registerFormModel', Object.assign(application, {
      formId: 'datacap_size_selection',
      state: 'valid'
    }))
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      application: 'general/application'
    }),
    pageData () {
      return this.siteContent.apply.page_content
    },
    faq () {
      return this.pageData.faq
    },
    faqHeading () {
      return this.faq.heading
    },
    count () {
      return this.faq.count
    },
    moreButton () {
      return this.faq.more_button
    },
    faqPageData () {
      return this.siteContent.faq.page_content
    },
    accordionToggleButtonText () {
      return this.faqPageData.accordion_button_toggle_text
    },
    faqList () {
      return this.faqPageData.faq.slice(0, 4)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-apply {
  overflow: hidden;
}

.overlay.type__noise {
  z-index: 5;
}

// ///////////////////////////////////////////////////////////////////////// FAQ
#section-faq {
  position: relative;
  border-top: 3px solid $nandor;
  z-index: 10;
}

.section-accordion {
  position: relative;
  left: calc(-#{math.div($containerWidth, 12)} / 2);
  width: calc(100% + #{math.div($containerWidth, 12)} / 2);
  margin-bottom: 6.5rem;
}

::v-deep .faq-heading {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 7.625rem;
  margin-bottom: 1.875rem;
  .bubble {
    left: calc((-100vw + #{$containerWidth}) / 2 - #{math.div($containerWidth, 12)} - 0.5rem - 3.125rem - 2px); // 100vw - gutter - 1 col - 1/2 col gutter - 2px border-width
    padding-left: calc(3.125rem + (100vw - #{$containerWidth}) / 2 + #{math.div($containerWidth, 12)} + 0.5rem);
    border-color: $nandor;
  }
}

.more-button {
  margin-top: 1.875rem;
}

// /////////////////////////////////////////////////////////////////// WarpImage
.panel-right {
  position: relative;
  height: 100%;
}

.warp-image-double {
  position: absolute;
  top: 0;
  left: 0;
  width: 30.5rem;
  height: 500rem;
  background-image: url('~assets/images/warp-image-double.svg');
  background-size: contain;
}
</style>
