<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroA
      :heading="heading"
      heading-cols="col-12">
      <div class="card-container">
        <Card
          corner-position="top-right"
          icon="arrow">
          <template v-if="formScaffold">

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

          </template>
        </Card>

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

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import HeroA from '@/components/hero-a'
import FaqAccordion from '@/components/faq-accordion'
import ButtonA from '@/components/buttons/button-a'
import Card from '@/components/card'
import FieldContainer from '@/components/form/field-container'
import Overlay from '@/components/overlay'

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
    Card,
    Overlay
  },

  data () {
    return {
      tag: 'apply'
    }
  },

  async fetch ({ store }) {
    await store.dispatch('general/getBaseData', { key: 'apply', data: ApplyPageData })
    await store.dispatch('general/getBaseData', { key: 'faq', data: FaqPageData })
    const formId = 'filplus_application'
    const application = store.getters['general/application']
    const model = await store.dispatch('form/getFormModel', formId)
    if (!model) {
      await store.dispatch('form/registerFormModel', Object.assign(application, { formId }))
    }
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
    submitThreshold () {
      return this.form.submit_threshold
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
      validateForm: 'form/validateForm',
      updateApplication: 'general/updateApplication'
    }),
    getValue (modelKey) {
      return this.application[modelKey]
    },
    async submitForm (e) {
      e.preventDefault()
      const incoming = await this.validateForm('filplus_application')
      if (incoming) {
        this.updateApplication(incoming)
        if (incoming.total_datacap_size <= this.submitThreshold) {
          this.$router.push('/apply/general/notaries')
        } else {
          this.$router.push('/apply/large')
        }
      }
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

.container {
  position: relative;
}

// //////////////////////////////////////////////////////////////////////// Hero
::v-deep #hero {
  .content {
    padding-bottom: 0;
  }
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

// //////////////////////////////////////////////////////////////////////// Card
.card-container {
  margin-top: 4.8125rem;
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
