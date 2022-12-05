<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroA
      :heading="heading"
      heading-cols="col12">
      <div class="card-container">
        <div class="card">

          <svg
            class="corner"
            viewBox="0 0 92 92"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M -1 94 C 62 94 18 94 91 94 V 94 C 91 78 78 65 62 65 L 59 65 C 42 65 28 51 28 34 L 28 32 L 28 30 C 28 14 15 1 -1 1 Z" fill="black" fill-opacity="0.4" stroke="white" stroke-width="2" />
          </svg>

          <div class="card-content">
            <div class="form-heading">
              {{ formHeading }}
            </div>
            <form class="form">

              <FieldContainer
                :scaffold="formScaffold.total_datacap_size_range"
                :value="getValue('total_datacap_size')"
                form-id="filplus_application"
                class="range-field" />

              <div class="row">
                <FieldContainer
                  :scaffold="formScaffold.total_datacap_size_input"
                  :value="getValue('total_datacap_size')"
                  form-id="filplus_application"
                  class="input-field" />
                <FieldContainer
                  :scaffold="formScaffold.total_datacap_size_unit"
                  :value="getValue('total_datacap_size_unit')"
                  form-id="filplus_application"
                  class="select-field" />
              </div>

              <ButtonA
                class="submit-button"
                @clicked="submitForm">
                {{ submitButtonText }}
              </ButtonA>

            </form>
          </div>

        </div>
      </div>
    </HeroA>

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

    <BackgroundGradients />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import HeroA from '@/components/hero-a'
import FaqAccordion from '@/components/faq-accordion'
import ButtonA from '@/components/buttons/button-a'
import FieldContainer from '@/components/form/field-container'
import Overlay from '@/components/overlay'
import BackgroundGradients from '@/components/background-gradients'

import ApplyPageData from '@/content/pages/apply.json'
import FaqPageData from '@/content/pages/faq.json'

// ====================================================================== Export
export default {
  name: 'ApplyPage',

  components: {
    HeroA,
    FaqAccordion,
    FieldContainer,
    ButtonA,
    Overlay,
    BackgroundGradients
  },

  data () {
    return {
      tag: 'apply'
    }
  },

  async fetch ({ store }) {
    await store.dispatch('general/getBaseData', { key: 'apply', data: ApplyPageData })
    await store.dispatch('general/getBaseData', { key: 'faq', data: FaqPageData })
    const application = store.getters['general/application']
    await store.dispatch('form/registerFormModel', Object.assign(application, {
      formId: 'filplus_application',
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
    heading () {
      return this.pageData.heading
    },
    form () {
      return this.pageData.form
    },
    formScaffold () {
      console.log(this.form.scaffold)
      return this.form.scaffold
    },
    formHeading () {
      return this.form.heading
    },
    submitButtonText () {
      return this.form.submit_button_text
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
  },

  methods: {
    ...mapActions({
      validateForm: 'form/validateForm'
    }),
    getValue (modelKey) {
      return this.application[modelKey]
    },
    async submitForm (e) {
      e.preventDefault()
      const incoming = await this.validateForm('datacap_size_selection')
      console.log(incoming)
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
::v-deep #hero {
  .bubble {
    margin-top: 2.75rem;
  }
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
    margin-top: 0.5rem;
  }
}

.more-button {
  margin-top: 1.875rem;
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

// //////////////////////////////////////////////////////////////////////// Card
.container {
  position: relative;
}

.card {
  position: relative;
  &:before,
  &:after {
    content: '';
    position: absolute;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 2;
    box-sizing: border-box;
  }
  &:before,
  &:after {
    left: 0;
  }
  &:before {
    top: 0;
    height: $squigglySizing;
    width: calc(100% - #{$squigglySizing});
    border-top-left-radius: $cardRadius;
    border-left: 2px solid $titanWhite;
    border-top: 2px solid $titanWhite;
  }
  &:after {
    top: $squigglySizing;
    height: calc(100% - #{$squigglySizing});
    width: 100%;
    border-bottom-left-radius: $cardRadius;
    border-bottom-right-radius: $cardRadius;
    border: 2px solid white;
    border-top: none;
  }
}

.corner {
  position: absolute;
  right: 0;
  top: 0;
  width: $squigglySizing;
  height: $squigglySizing;
}

.card-content {
  position: relative;
  padding: 3.125rem 7rem 1.875rem 3.4375rem;
  margin-top: 4.8125rem;
  z-index: 10;
}

// //////////////////////////////////////////////////////////////////////// Form
.form-heading {
  margin-bottom: 2.5rem;
  font-size: toRem(24);
  line-height: leading(35, 24);
  font-weight: 500;
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
