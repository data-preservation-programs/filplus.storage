<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroB
      :label="hero.label"
      :heading="hero.heading"
      content-cols="col-5" />

    <!-- ======================================================= Application -->
    <div id="application">

      <Squigglie
        :percent-left="10"
        orientation="up"
        color="nandor"
        :thick="true"
        class="section-app-top-border" />

      <div class="grid">
        <div class="col-6" data-push-left="off-1">

          <div class="form-heading">
            {{ formHeading }}
          </div>

          <FieldContainer
            :scaffold="formScaffold.application_name"
            :value="getValue('application_name')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.organization_name"
            :value="getValue('organization_name')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.organization_website"
            :value="getValue('organization_website')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.region"
            :value="getValue('region')"
            form-id="filplus_application" />

        </div>
      </div>

      <div class="grid">
        <div class="col-6" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold.organization_social_media_handle"
            :value="getValue('organization_social_media_handle')"
            form-id="filplus_application" />
        </div>
        <div class="col-2" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold.organization_social_media_handle_type"
            :value="getValue('organization_social_media_handle_type')"
            form-id="filplus_application" />
        </div>
      </div>

      <div class="grid">
        <div class="col-6" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold.total_datacap_size"
            :value="getValue('total_datacap_size')"
            form-id="filplus_application" />
        </div>
        <div class="col-2" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold.total_datacap_size_unit"
            :value="getValue('total_datacap_size_unit')"
            form-id="filplus_application" />
        </div>
      </div>

      <div class="grid">
        <div class="col-6" data-push-left="off-1">

          <FieldContainer
            :scaffold="formScaffold.filecoin_address"
            :value="getValue('filecoin_address')"
            form-id="filplus_application" />

          <ButtonA
            class="submit-button"
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
    const notary = NotariesListData.find(notary => notary.Miner === name)
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
      application: 'general/application'
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
    submitButtonText () {
      return this.form.submit_button_text
    }
  },

  methods: {
    ...mapActions({
      validateForm: 'form/validateForm',
      submitGeneralApplication: 'general/submitGeneralApplication'
    }),
    getValue (modelKey) {
      return this.application[modelKey]
    },
    async submitForm () {
      const incoming = await this.validateForm('filplus_application')
      console.log(incoming)
      this.submitGeneralApplication(incoming)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-large {
  overflow: hidden;
}

#application {
  position: relative;
  padding: 8.75rem 0;
  border-bottom: 2px solid $nandor;
  z-index: 10;
}

.section-app-top-border {
  top: -3px;
}

.form-heading {
  @include headingHighlight;
  margin-bottom: 3rem;
}

.field-container {
  margin-bottom: 3.5rem;
}
</style>
