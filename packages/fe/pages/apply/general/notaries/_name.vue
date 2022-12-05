<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroB
      :label="hero.label"
      :heading="hero.heading"
      content-cols="col-5" />

    <!-- ======================================================= Application -->
    <div id="application">

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

import HeroB from '@/components/hero-b'
import FieldContainer from '@/components/form/field-container'
import Overlay from '@/components/overlay'

import ApplyGeneralPageData from '@/content/pages/apply-general.json'

// ====================================================================== Export
export default {
  name: 'ApplyGeneralPage',

  components: {
    HeroB,
    FieldContainer,
    Overlay
  },

  data () {
    return {
      tag: 'apply-general'
    }
  },

  async fetch ({ store }) {
    await store.dispatch('general/getBaseData', { key: 'apply-general', data: ApplyGeneralPageData })
    const application = store.getters['general/application']
    if (!application) {
      await store.dispatch('form/registerFormModel', Object.assign(application, {
        formId: 'filplus_application',
        state: 'valid'
      }))
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
      return this.siteContent['apply-general'].page_content
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
    }
  },

  methods: {
    getValue (modelKey) {
      return this.application[modelKey]
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

.form-heading {
  @include headingHighlight;
  margin-bottom: 3rem;
}

.field-container {
  margin-bottom: 3.5rem;
}
</style>
