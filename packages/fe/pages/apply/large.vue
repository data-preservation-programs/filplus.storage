<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroB
      :label="hero.label"
      :heading="heroHeading"
      :subtext="hero.subtext" />

    <!-- ============================== [Application] Background Information -->
    <div id="application-top">

      <Squigglie
        :percent-left="10"
        orientation="down"
        color="nandor"
        :thick="true"
        class="section-bg-top-border" />

      <div class="grid">
        <div class="col-6" data-push-left="off-1">

          <div class="form-heading-1">
            {{ formHeading1 }}
          </div>

          <FieldContainer
            :scaffold="formScaffold.organization_name"
            :value="getValue('organization_name')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.data_owner_region"
            :value="getValue('data_owner_region')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.data_owner_industry"
            :value="getValue('data_owner_industry')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.organization_website"
            :value="getValue('organization_website')"
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
            :scaffold="formScaffold.total_datacap_size_input"
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
            :scaffold="formScaffold.weekly_data_size"
            :value="getValue('weekly_data_size')"
            form-id="filplus_application" />
        </div>
        <div class="col-2" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold.weekly_data_size_unit"
            :value="getValue('weekly_data_size_unit')"
            form-id="filplus_application" />
        </div>
      </div>

      <div class="grid">
        <div class="col-6" data-push-left="off-1">

          <FieldContainer
            :scaffold="formScaffold.filecoin_address"
            :value="getValue('filecoin_address')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.custom_multisig"
            :value="getValue('custom_multisig')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.identifier"
            :value="getValue('identifier')"
            form-id="filplus_application" />

        </div>
      </div>

    </div>

    <!-- ================================================ [Application] Full -->
    <div id="application-bottom">

      <Squigglie
        :percent-left="90"
        orientation="up"
        color="nandor"
        :thick="true"
        class="section-app-top-border" />

      <div class="grid">
        <div class="col-7" data-push-left="off-1">

          <div class="form-heading-2">
            {{ formHeading2 }}
          </div>

          <FieldContainer
            :scaffold="formScaffold.about"
            :value="getValue('about')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.ecosystem_associates_radio"
            :value="getValue('ecosystem_associates_radio')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.ecosystem_associates_textarea"
            :value="getValue('ecosystem_associates_textarea')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.nature_of_data"
            :value="getValue('nature_of_data')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.source_of_data_select"
            :value="getValue('source_of_data_select')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.source_of_data_textarea"
            :value="getValue('source_of_data_textarea')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.data_preparation_plan_select"
            :value="getValue('data_preparation_plan_select')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.data_preparation_plan_textarea"
            :value="getValue('data_preparation_plan_textarea')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.data_sample"
            :value="getValue('data_sample')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.public_availability_radio"
            :value="getValue('public_availability_radio')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.public_availability_textarea"
            :value="getValue('public_availability_textarea')"
            form-id="filplus_application" />

        </div>
      </div>

      <div class="grid">
        <div class="col-5" data-push-left="off-1">
          FIELD
        </div>
        <div class="col-4" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold.frequency_of_retrieval"
            :value="getValue('frequency_of_retrieval')"
            form-id="filplus_application" />
        </div>
      </div>

      <div class="grid">
        <div class="col-7" data-push-left="off-1">

          <FieldContainer
            :scaffold="formScaffold.duration_of_storage"
            :value="getValue('duration_of_storage')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.geographic_distribution"
            :value="getValue('geographic_distribution')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.sending_data"
            :value="getValue('sending_data')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.storage_provider_selection_plan_select"
            :value="getValue('storage_provider_selection_plan_select')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.storage_provider_selection_plan_input"
            :value="getValue('storage_provider_selection_plan_input')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.storage_provider_selection_plan_textarea"
            :value="getValue('storage_provider_selection_plan_textarea')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.replication_plan_select"
            :value="getValue('replication_plan_select')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.replication_plan_textarea"
            :value="getValue('replication_plan_textarea')"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.confirm_follow_fil_guideline"
            :value="getValue('confirm_follow_fil_guideline')"
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

import ApplyLargePageData from '@/content/pages/apply-large.json'

// ====================================================================== Export
export default {
  name: 'ApplyLargePage',

  components: {
    HeroB,
    FieldContainer,
    ButtonA,
    Overlay,
    Squigglie
  },

  data () {
    return {
      tag: 'apply-large'
    }
  },

  async fetch ({ store }) {
    await store.dispatch('general/getBaseData', { key: 'apply-large', data: ApplyLargePageData })
    await store.dispatch('general/getNetworkStorageCapacity')
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
      networkStorageCapacity: 'general/networkStorageCapacity'
    }),
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    hero () {
      return this.pageData.hero
    },
    heroHeading () {
      return this.hero.heading.replace('|data|', this.networkStorageCapacity)
    },
    form () {
      return this.pageData.form
    },
    formHeading1 () {
      return this.form.heading_1
    },
    formHeading2 () {
      return this.form.heading_2
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
      submitLargeApplication: 'general/submitLargeApplication'
    }),
    getValue (modelKey) {
      return this.application[modelKey]
    },
    async submitForm () {
      const incoming = await this.validateForm('filplus_application')
      console.log(incoming)
      this.submitLargeApplication(incoming)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-large {
  overflow: hidden;
}

#application-top,
#application-bottom {
  position: relative;
  padding: 8.75rem 0;
  z-index: 10;
}

#application-top {
  position: relative;
  padding: 8.75rem 0;
  border-bottom: 2px solid $nandor;
  [class~=grid], [class*=grid-], [class*=grid_] {
    @include descendingZindex(5);
    position: relative;
  }
}

.section-bg-top-border,
.section-app-top-border {
  top: -3px;
}

#application-bottom {
  :deep(.field-wrapper) {
    .field-label {
      margin-bottom: 1.5rem;
    }
  }
}

.form-heading-1,
.form-heading-2 {
  @include headingHighlight;
  margin-bottom: 3rem;
}

.field-container {
  margin-bottom: 3.5rem;
}
</style>
