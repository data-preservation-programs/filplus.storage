<template>
  <div :class="`page page-${tag}`">

    <!-- ============================================================== Hero -->
    <HeroB
      :label="hero.label"
      :heading="heroHeading"
      :tooltip="headingTooltip"
      :subtext="hero.subtext"
      :hero-button="backButton"
      :kyc-heading="kycHeading" />

    <form id="form">

      <!-- ============================ [Application] Background Information -->
      <div id="application-top">

        <Squigglie
          :percent-left="10"
          orientation="down"
          color="nandor"
          :thick="true"
          class="section-bg-top-border" />

        <div class="grid">
          <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

            <div class="form-heading-1">
              {{ formHeading1 }}
            </div>

            <FieldContainer :scaffold="formScaffold.data_owner_name" />
            <HubspotOptInFields />
            <FieldContainer :scaffold="formScaffold.your_role" />
            <FieldContainer :scaffold="formScaffold.data_owner_region" />
            <FieldContainer :scaffold="formScaffold.data_owner_industry" />
            <FieldContainer :scaffold="formScaffold.website" />

          </div>
        </div>

        <div class="grid">
          <div class="col-6_md-6_ti-7" data-push-left="off-1_ti-0">
            <FieldContainer :scaffold="formScaffold.social_media_handle" />
          </div>
          <div class="col-2_md-3_ti-4" data-push-left="off-1">
            <FieldContainer :scaffold="formScaffold.social_media_handle_type" />
          </div>
        </div>

        <div class="grid">
          <div class="col-6_md-6_ti-7" data-push-left="off-1_ti-0">
            <FieldContainer :scaffold="formScaffold.total_datacap_size_input" />
          </div>
          <div class="col-2_md-3_ti-4" data-push-left="off-1">
            <FieldContainer :scaffold="formScaffold.total_datacap_size_unit" />
          </div>
        </div>

        <div class="grid">
          <div class="col-6_md-6_ti-7" data-push-left="off-1_ti-0">
            <FieldContainer :scaffold="formScaffold.total_size_of_single_dataset_one_copy" />
          </div>
          <div class="col-2_md-3_ti-4" data-push-left="off-1">
            <FieldContainer :scaffold="formScaffold.total_size_of_single_dataset_one_copy_unit" />
          </div>
          <div class="col-6_md-6_ti-7" data-push-left="off-1_ti-0">
            <FieldContainer :scaffold="formScaffold.number_of_replicas" />
          </div>
        </div>

        <div class="grid">
          <div class="col-6_md-6_ti-7" data-push-left="off-1_ti-0">
            <FieldContainer :scaffold="formScaffold.weekly_data_size" />
          </div>
          <div class="col-2_md-3_ti-4" data-push-left="off-1">
            <FieldContainer :scaffold="formScaffold.weekly_data_size_unit" />
          </div>
        </div>

        <div class="grid">
          <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">
            <FieldContainer :scaffold="formScaffold.filecoin_address" />
            <FieldContainer :scaffold="formScaffold.application_data_type" />
          </div>
        </div>

      </div>

      <!-- ============================================== [Application] Full -->
      <div id="application-bottom">

        <Squigglie
          :percent-left="90"
          :thick="true"
          orientation="up"
          color="nandor"
          class="section-app-top-border" />

        <div class="grid">
          <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

            <div class="form-heading-2">
              {{ formHeading2 }}
            </div>

            <FieldContainer :scaffold="formScaffold.project_details" />
            <FieldContainer :scaffold="formScaffold.ecosystem_associates_radio" />
            <FieldContainer :scaffold="formScaffold.ecosystem_associates_textarea" />
            <FieldContainer :scaffold="formScaffold.nature_of_data" />
            <FieldContainer :scaffold="formScaffold.source_of_data_select" />
            <FieldContainer :scaffold="formScaffold.source_of_data_textarea" />
            <FieldContainer :scaffold="formScaffold.data_preparer_radio" />
            <FieldContainer :scaffold="formScaffold.data_preparer_location" />
            <FieldContainer :scaffold="formScaffold.data_preparer_preparation_plan" />
            <FieldContainer :scaffold="formScaffold.general_preparation_plan" />
            <FieldContainer :scaffold="formScaffold.data_stored_before_radio" />
            <FieldContainer :scaffold="formScaffold.dataset_stored_before_textarea" />
            <FieldContainer :scaffold="formScaffold.data_sample" />

          </div>
        </div>

        <div class="grid">
          <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

            <FieldContainer :scaffold="formScaffold.frequency_of_retrieval" />
            <FieldContainer :scaffold="formScaffold.duration_of_storage" />
            <FieldContainer :scaffold="formScaffold.geographic_distribution" />
            <FieldContainer :scaffold="formScaffold.data_distribution" />
            <FieldContainer :scaffold="formScaffold.storage_provider_selection_plan_select" />
            <FieldContainer :scaffold="formScaffold.storage_provider_selection_plan_input" />
            <FieldContainer :scaffold="formScaffold.storage_provider_selection_plan_textarea" />
            <FieldContainer :scaffold="formScaffold.replication_plan_select" />
            <FieldContainer :scaffold="formScaffold.replication_plan_textarea" />
            <FieldContainer :scaffold="formScaffold.confirm_follow_fil_guideline" />

            <div class="buttons bottom">
              <ButtonA
                v-if="account"
                class="submit-button"
                loader="application-submit-button"
                @clicked="submitForm">
                {{ submitButtonText }}
              </ButtonA>

              <LoginButton />

              <ButtonX
                :to="backButton.href"
                :tag="backButton.type"
                :theme="backButton.theme">
                <Chevron />
                <div class="text" v-html="backButton.label" />
              </ButtonX>

            </div>
          </div>
        </div>

      </div>

      <!-- ==================================================== Form Toolbar -->
      <!-- Needs to be placed AFTER all the fields for its mounted hook to fire correctly -->
      <FormToolbar form-id="filplus_application" />

    </form>

    <!-- ========================================================== Overlays -->
    <Overlay type="noise" />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import HeroB from '@/components/hero-b'
import FormToolbar from '@/components/form/form-toolbar'
import FieldContainer from '@/components/form/field-container'
import ButtonA from '@/components/buttons/button-a'
import ButtonX from '@/components/buttons/button-x'
import HubspotOptInFields from '@/components/hubspot-opt-in-fields'
import Overlay from '@/components/overlay'
import Squigglie from '@/components/squigglie'
import LoginButton from '@/components/navigation/button-login'
import Chevron from '@/components/icons/chevron'

import ApplyLargePageData from '@/content/pages/apply-large.json'

// ====================================================================== Export
export default {
  name: 'ApplyLargePage',

  components: {
    HeroB,
    FormToolbar,
    FieldContainer,
    ButtonA,
    ButtonX,
    HubspotOptInFields,
    Overlay,
    Squigglie,
    LoginButton,
    Chevron
  },

  data () {
    return {
      tag: 'apply-large'
    }
  },

  async fetch ({ app, store }) {
    await store.dispatch('general/getBaseData', { key: 'apply-large', data: ApplyLargePageData })
    await store.dispatch('general/getNetworkStorageCapacity')
    await store.dispatch('account/setHubspotOptInData', store.getters['auth/account'])
    await store.dispatch('form/registerModel', { id: 'filplus_application', data: store.getters['account/application'] })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      networkStorageCapacity: 'general/networkStorageCapacity',
      application: 'account/application',
      account: 'auth/account'
    }),
    generalPageData () {
      return this.siteContent.general
    },
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    hero () {
      return this.pageData.hero
    },
    heroHeading () {
      return this.hero.heading.replace('|data|', this.networkStorageCapacity).replace('|data-tooltip|', `data-tooltip="${this.headingTooltip}"`)
    },
    headingTooltip () {
      const tooltip = this.hero.heading_tooltip
      return tooltip && tooltip !== '' ? tooltip : false
    },
    kycHeading () {
      return this.hero.kyc_heading
    },
    backButton () {
      return this.pageData.back_button
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
    },
    githubIssueLinkText () {
      return this.form.github_issue_link_text
    },
    formsData () {
      return this.generalPageData.forms
    },
    formsThresholds () {
      return this.formsData.thresholds
    }
  },

  methods: {
    ...mapActions({
      validateForm: 'form/validateForm',
      submitApplication: 'account/submitApplication'
    }),
    async submitForm () {
      const pass = await this.$form.validate('filplus_application')
      console.log(pass)
      const inputField = this.$field.get('total_datacap_size_input')
      const unitField = this.$field.get('total_datacap_size_unit')
      const bytes = this.$convertSizeToBytes(inputField.value, unitField.scaffold.options[unitField.value].label)
      const thresholds = this.formsThresholds
      await this.$handleFormRedirection(bytes, 'stage-lda', thresholds)
      if (!pass) {
        const firstInvalidField = document.querySelector('.error')
        this.$scrollToElement(firstInvalidField, 250, -200)
      }
      if (pass) {
        const application = await this.$form.applyFormToSchema('filplus_application', this.application)
        console.log(application)
        // await this.submitApplication({ application, bytes, thresholds })
      }
      this.$button('application-submit-button').set({ loading: false })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-apply-large {
  overflow: hidden;
}

[class~=grid], [class*=grid-], [class*=grid_] {
  @include descendingZindex(100);
}

[class~=col], [class*=col-], [class*=col_] {
  @include descendingZindex(100);
}

.field-container {
  @include descendingZindex(100);
}

#form {
  position: relative;
}

#application-top,
#application-bottom {
  position: relative;
  padding: 8.75rem 0;
}

#application-top {
  z-index: 10;
}

#application-bottom {
  z-index: 5;
}

.buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  .button-x {
    margin-left: 2rem;
  }
}

.github-issue-link-button {
  &:hover {
    :deep(svg) {
      path {
        transition: 150ms ease-in;
        fill: $titanWhite;
      }
    }
  }
  :deep(svg) {
    width: 1rem;
    margin-right: 0.5rem;
    path {
      transition: 150ms ease-out;
      fill: $aztec;
    }
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
  position: relative;
  margin-bottom: 3rem;
}

.field-container {
  margin-bottom: 3.5rem;
}
</style>
