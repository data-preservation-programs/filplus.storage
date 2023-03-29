<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroA
      :heading="heading"
      heading-cols="col-12" />

    <!-- =============================================================== FAQ -->
    <div id="section-faq">

      <Squigglie
        :percent-left="6"
        orientation="down"
        color="nandor"
        :thick="true"
        class="faq-top-border" />

      <div class="grid-spaceBetween">

        <div class="col-7_lg-8_sm-9_mi-10" data-push-left="off-1_mi-0">

          <FaqAccordion
            :entries="faqList"
            :toggle-button-content="accordionToggleButtonText" />

          <div
            v-if="ctaCard"
            class="cta-card-wrapper"
            @click="$highlightApplyForm">
            <Card
              icon="arrow"
              :outline="true"
              class="apply-cta-card">
              <div class="title">
                {{ ctaCard.title }}
              </div>

              <div
                class="description"
                v-html="ctaCard.description">
              </div>
            </Card>
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
import FaqAccordion from '@/components/faq-accordion'
import Overlay from '@/components/overlay'
import Squigglie from '@/components/squigglie'
import Card from '@/components/card'

import FaqPageData from '@/content/pages/faq.json'

// ====================================================================== Export
export default {
  name: 'FaqPage',

  components: {
    HeroA,
    FaqAccordion,
    Overlay,
    Squigglie,
    Card
  },

  data () {
    return {
      tag: 'faq'
    }
  },

  async fetch ({ app, store }) {
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
  position: relative;
  overflow: hidden;
}

.overlay.type__noise {
  z-index: 5;
}

// //////////////////////////////////////////////////////////////////////// Hero
:deep(.hero-content) {
  @include mini {
    padding-bottom: 7rem;
  }
  .heading {
    align-items: flex-start;
    br {
      display: none;
    }
  }
  .bubble {
    margin-top: 0;
    @include small {
      margin-top: 1.5rem;
    }
    @include mini {
      padding: 0.75rem 1.5rem;
      margin-top: 1rem;
      white-space: nowrap;
    }
  }
}

// ///////////////////////////////////////////////////////////////////////// FAQ
#section-faq {
  position: relative;
  padding-bottom: 4.125rem;
  border-top: 3px solid transparent;
  z-index: 25;
}

.faq-top-border {
  top: -3px;
}

.faq-accordion {
  padding: 5rem 0;
}

:deep(.accordion-wrapper) {
  width: 100%;
}

:deep(.faq-accordion) {
  padding-right: 5rem;
  @include small {
    padding-right: 3rem;
  }
  @include mini {
    padding-right: 0;
  }
}

.cta-card-wrapper {
  cursor: pointer;
}

.apply-cta-card.corner-position__top-right {
  display: inline-block;
  width: 26.6875rem;
  @include medium {
    width: calc(100% - 5rem);
  }
  @include small {
    width: calc(100% - 3rem);
  }
  @include mini {
    width: 100%;
  }
  &:hover {
    :deep(.icon.arrow) {
      transform: rotate(45deg);
    }
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
    padding: toRem(37) 2rem 1.875rem toRem(43) !important;
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
