<template>
  <div :class="`page page-${tag}`">

    <!-- ============================================================== Hero -->
    <HeroA
      :heading="heading"
      heading-cols="col-12_mi-10_ti-12"
      content-cols="col-8_sm-10_mi-12">
      <ApplyFormCard id="apply-form-card" />
    </HeroA>

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
import ButtonA from '@/components/buttons/button-a'
import ApplyFormCard from '@/components/apply-form-card'
import Overlay from '@/components/overlay'
import Squigglie from '@/components/squigglie'

import ApplyPageData from '@/content/pages/apply.json'
import FaqPageData from '@/content/pages/faq.json'

// ====================================================================== Export
export default {
  name: 'ApplyPage',

  components: {
    HeroA,
    FaqAccordion,
    ApplyFormCard,
    ButtonA,
    Overlay,
    Squigglie
  },

  data () {
    return {
      tag: 'apply'
    }
  },

  async fetch ({ app, store }) {
    await store.dispatch('general/getBaseData', { key: 'apply', data: ApplyPageData })
    await store.dispatch('general/getBaseData', { key: 'faq', data: FaqPageData })
    await store.dispatch('account/setHubspotOptInData', store.getters['auth/account'])
    await store.dispatch('form/registerModel', { id: 'filplus_application', data: store.getters['account/application'] })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      applyFormHighlighted: 'general/applyFormHighlighted'
    }),
    generalPageData () {
      return this.siteContent.general
    },
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    heading () {
      return this.pageData.heading
    },
    form () {
      return this.pageData.form
    },
    formScaffold () {
      return this.form.scaffold
    },
    formHeading () {
      return this.form.heading
    },
    submitButtonText () {
      return this.form.submit_button_text
    },
    submitThresholdBottom () {
      return this.generalPageData.forms.submit_threshold_bottom
    },
    submitThresholdMiddle () {
      return this.generalPageData.forms.submit_threshold_middle
    },
    submitThresholdTop () {
      return this.generalPageData.forms.submit_threshold_top
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
$squigglySizing: 5.75rem;
$cardRadius: 1.875rem;

// ///////////////////////////////////////////////////////////////////// General
.page-apply {
  overflow: hidden;
}

.overlay.type__noise {
  z-index: 5;
}

// //////////////////////////////////////////////////////////////////////// Hero
::v-deep #hero.hero-a {
  height: calc(61.625rem + #{$siteHeaderHeight});
  @include large {
    padding-bottom: toRem(144);
  }
  @include mini {
    padding-bottom: toRem(106);
  }
  .heading {
    @include h1;
  }
  .bubble {
    margin-top: 1.5rem;
    white-space: nowrap;
    @include small {
      margin-top: 1rem;
    }
    @include mini {
      padding: 0.75rem 1.5rem;
    }
  }
}

// ///////////////////////////////////////////////////////////////////////// FAQ
#section-faq {
  position: relative;
  z-index: 25;
  .faq-top-border {
    top: -3px;
  }
}

.section-accordion {
  position: relative;
  padding-right: toRem(50);
  margin-bottom: 6.5rem;
  @include mini {
    padding-right: 0;
  }
}

::v-deep .faq-heading {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 7.625rem;
  margin-bottom: 1.875rem;
  @include small {
    font-size: toRem(50);
  }
  @include mini {
    font-size: toRem(35);
    margin-top: toRem(50);
  }
  .bubble {
    left: calc((-100vw + #{$containerWidth}) / 2 - #{math.div($containerWidth, 12)} - 0.5rem - 3.125rem - 2px); // 100vw - gutter - 1 col - 1/2 col gutter - 2px border-width
    padding-left: calc(3.125rem + (100vw - #{$containerWidth}) / 2 + #{math.div($containerWidth, 12)} + 0.5rem);
    border-color: $nandor;
    margin-top: 0.5rem;
    @include containerMaxMQ {
      left: toRem(-200);
      padding-left: toRem(200);
    }
  }
}

.more-button {
  margin-top: 1.875rem;
}

// //////////////////////////////////////////////////////////////////////// Card
#apply-form-card {
  margin-top: 4.8125rem;
  @include mini {
    margin-top: 2rem;
  }
  :deep(.content) {
    @include mini {
      padding: 1.875rem 2.5rem 3.125rem 2.5rem !important;
    }
  }
}

:deep(.card.corner-position__bottom-right) {
  &.highlighted {
    .panel {
      &:before,
      &:after,
      svg path {
        transition: 250ms ease-in;
      }
      &:before,
      &:after {
        border-color: $greenYellow;
      }
      svg path {
        stroke: $greenYellow;
      }
    }
  }
  .panel {
    &:before,
    &:after,
    svg path {
      transition: 250ms ease-out;
    }
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

// //////////////////////////////////////////////////////////////////////// Form
.form-heading {
  margin-bottom: 2.5rem;
  font-size: toRem(24);
  line-height: leading(35, 24);
  font-weight: 500;
  @include mini {
    font-size: toRem(18);
  }
}

.field-container {
  :deep(.field-label) {
    display: none;
  }
}

.range-field {
  margin-bottom: 2.5rem;
}

.row {
  display: flex;
  flex-direction: row;
}

.input-field {
  position: relative;
  width: 6.25rem;
  margin-right: 1.125rem;
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: calc(100% + 0.4375rem);
    width: 0.25rem;
    height: 2px;
    background-color: $titanWhite;
  }
}

.select-field {
  width: 3.75rem;
}
</style>
