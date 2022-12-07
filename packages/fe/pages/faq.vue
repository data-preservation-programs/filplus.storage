<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroA
      :heading="heading"
      heading-cols="col-12" />

    <!-- =============================================================== FAQ -->
    <div id="section-faq">
      <div class="grid-spaceBetween">

        <div class="col-7" data-push-left="off-1">
          <FaqAccordion
            :entries="faqList"
            :toggle-button-content="accordionToggleButtonText" />

          <Card
            icon="arrow"
            :outline="true"
            class="apply-cta-card">
            <template v-if="ctaCard">

              <div class="title">
                {{ ctaCard.title }}
              </div>

              <div
                class="description"
                v-html="ctaCard.description">
              </div>

            </template>
          </Card>
        </div>

        <div class="col-3">
          <div class="panel-right">
            <div class="warp-image-double" />
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================================== Overlays -->
    <Overlay type="noise" />

    <BackgroundGradients />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import HeroA from '@/components/hero-a'
import FaqAccordion from '@/components/faq-accordion'
import Overlay from '@/components/overlay'
import Card from '@/components/card'
import BackgroundGradients from '@/components/background-gradients'

import FaqPageData from '@/content/pages/faq.json'

// ====================================================================== Export
export default {
  name: 'FaqPage',

  components: {
    HeroA,
    FaqAccordion,
    Overlay,
    Card,
    BackgroundGradients
  },

  data () {
    return {
      tag: 'faq'
    }
  },

  async fetch ({ store }) {
    await store.dispatch('general/getBaseData', { key: 'faq', data: FaqPageData })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    heading () {
      return this.pageData.heading
    },
    accordionToggleButtonText () {
      return this.pageData.accordion_button_toggle_text
    },
    faqList () {
      return this.pageData.faq
    },
    ctaCard () {
      return this.pageData.cta_card
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-faq {
  overflow: hidden;
}

.overlay.type__noise {
  z-index: 5;
}

// //////////////////////////////////////////////////////////////////////// Hero
::v-deep #hero {
  .bubble {
    margin-top: 2.75rem;
  }
}

// ///////////////////////////////////////////////////////////////////////// FAQ
#section-faq {
  position: relative;
  padding-bottom: 4.125rem;
  border-top: 3px solid $nandor;
  z-index: 10;
}

.faq-accordion {
  padding: 5rem 0;
}

// .section-accordion {
//   position: relative;
//   left: calc(-#{math.div($containerWidth, 12)} / 2);
//   width: calc(100% + #{math.div($containerWidth, 12)} / 2);
//   margin-bottom: 6.5rem;
// }

// ::v-deep .faq-heading {
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   margin-top: 7.625rem;
//   margin-bottom: 1.875rem;
//   .bubble {
//     left: calc((-100vw + #{$containerWidth}) / 2 - #{math.div($containerWidth, 12)} - 0.5rem - 3.125rem - 2px); // 100vw - gutter - 1 col - 1/2 col gutter - 2px border-width
//     padding-left: calc(3.125rem + (100vw - #{$containerWidth}) / 2 + #{math.div($containerWidth, 12)} + 0.5rem);
//     border-color: $nandor;
//     margin-top: 0.5rem;
//   }
// }
//
// .more-button {
//   margin-top: 1.875rem;
// }

.apply-cta-card {
  width: 57%;
  @include medium {
    width: 100%;
  }
  .title {
    font-size: toRem(30);
    line-height: leading(40, 30);
    font-weight: 500;
    margin-bottom: 1.5rem;
    margin-right: 5rem;
  }
  .description {
    margin-bottom: toRem(27);
  }
  :deep(.content) {
    padding: toRem(37) 2rem 1.875rem toRem(43);
  }
}

// ////////////////////////////////////////////////////////////////// Warp Image
.panel-right {
  position: relative;
  height: 100%;
}

.warp-image-double {
  position: absolute;
  top: 0;
  left: 0;
  width: 69rem;
  height: 500rem;
  background-image: url('~assets/images/warp-image-double.png');
  background-position: top left;
  background-size: 69rem;
}
</style>
