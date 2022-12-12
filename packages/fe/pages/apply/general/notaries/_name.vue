<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroB
      :label="hero.label"
      :heading="hero.heading" />

    <!-- ======================================================= Application -->
    <div id="application">

      <Squigglie
        :percent-left="10"
        orientation="down"
        color="nandor"
        :thick="true"
        class="section-app-top-border" />

      <div class="grid">
        <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

          <div class="form-heading">
            <span>{{ formHeading }}</span>
            <ButtonA
              v-if="savedFormExists"
              class="restore-saved-form-button"
              @clicked="restoreSavedForm('filplus_application')">
              {{ restoreSavedFormButtonText }}
            </ButtonA>
          </div>

          <FieldContainer
            :scaffold="formScaffold.organization_name"
            :value="getValue('organization_name')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.organization_website"
            :value="getValue('organization_website')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.ga_region"
            :value="getValue('ga_region')"
            form-id="filplus_application" />

        </div>
      </div>

      <div class="grid">
        <div class="col-6_md-6_ti-7 z-index-100" data-push-left="off-1_ti-0">
          <FieldContainer
            :scaffold="formScaffold.organization_social_media_handle"
            :value="getValue('organization_social_media_handle')"
            form-id="filplus_application" />
        </div>
        <div class="col-2_md-3_ti-4" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold.organization_social_media_handle_type"
            :value="getValue('organization_social_media_handle_type')"
            form-id="filplus_application" />
        </div>
      </div>

      <div class="grid">
        <div class="col-6_md-6_ti-7 z-index-100" data-push-left="off-1_ti-0">
          <FieldContainer
            :scaffold="formScaffold.total_datacap_size_input"
            :value="getValue('total_datacap_size')"
            form-id="filplus_application" />
        </div>
        <div class="col-2_md-3_ti-4" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold.total_datacap_size_unit"
            :value="getValue('total_datacap_size_unit')"
            form-id="filplus_application" />
        </div>
      </div>

      <div class="grid">
        <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

          <FieldContainer
            :scaffold="formScaffold.filecoin_address"
            :value="getValue('filecoin_address')"
            form-id="filplus_application" />

          <ButtonA
            class="submit-button"
            loader="ga-submit-button"
            @clicked="submitForm">
            {{ submitButtonText }}
          </ButtonA>

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

import HeroB from '@/components/hero-b'
import FieldContainer from '@/components/form/field-container'
import ButtonA from '@/components/buttons/button-a'
import Overlay from '@/components/overlay'
import Squigglie from '@/components/squigglie'

import ApplyGeneralPageData from '@/content/pages/apply-general.json'
import NotariesListData from '@/content/data/notaries-list.json'

// ====================================================================== Export
export default {
  name: 'ApplyGeneralPage',

  components: {
    HeroB,
    FieldContainer,
    ButtonA,
    Overlay,
    Squigglie
  },

  data () {
    return {
      tag: 'apply-general'
    }
  },

  async fetch ({ store, params, redirect }) {
    const name = params.name
    const notary = NotariesListData.find(notary => notary.name === name)
    if (!notary) { return redirect('/apply/general/notaries') }
    await store.dispatch('general/updateApplication', { notary: name })
    await store.dispatch('general/getBaseData', { key: 'apply-general', data: ApplyGeneralPageData })
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
      application: 'general/application',
      savedFormExists: 'form/savedFormExists'
    }),
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    hero () {
      return this.pageData.hero
    },
    form () {
      return this.pageData.form
    },
    formHeading () {
      return this.form.heading
    },
    formScaffold () {
      return this.form.scaffold
    },
    restoreSavedFormButtonText () {
      return this.form.restore_saved_form_button_text
    },
    submitButtonText () {
      return this.form.submit_button_text
    }
  },

  methods: {
    ...mapActions({
      validateForm: 'form/validateForm',
      submitGeneralApplication: 'general/submitGeneralApplication',
      restoreSavedForm: 'form/restoreSavedForm'
    }),
    getValue (modelKey) {
      return this.application[modelKey]
    },
    async submitForm () {
      const incoming = await this.validateForm('filplus_application')
      console.log(incoming)
      if (!incoming) {
        const firstInvalidField = document.querySelector('.error')
        this.$scrollToElement(firstInvalidField, 250, -200)
      } else {
        this.submitGeneralApplication(incoming)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-apply-general {
  position: relative;
  overflow: hidden;
}

#application {
  position: relative;
  padding: 8.75rem 0;
  z-index: 10;
  overflow: hidden;
}

.section-app-top-border {
  top: 0px;
}

.form-heading {
  @include headingHighlight;
  position: relative;
  margin-bottom: 3rem;
  padding-right: 2rem;
  @include small {
    * {
      display: block;
    }
  }
}

.restore-saved-form-button {
  position: absolute;
  top: 50%;
  left: calc(100% + 1rem);
  transform: translateY(-50%);
  @include small {
    position: relative;
    top: 0;
    left: 0;
    transform: none;
    margin-top: 1.5rem;
  }
}

.field-container {
  margin-bottom: 3.5rem;
}
</style>
