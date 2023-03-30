<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroB
      :label="hero.label"
      :heading="heroHeading"
      :tooltip="headingTooltip"
      :subtext="hero.subtext"
      :hero-button="backButton" />

    <!-- ============================== [Application] Background Information -->
    <div id="application-top">

      <Squigglie
        :percent-left="10"
        orientation="down"
        color="nandor"
        :thick="true"
        class="section-bg-top-border" />

      <div class="grid zindex-descend-12">
        <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

          <div class="form-heading-1">
            {{ formHeading1 }}
            <ButtonA
              v-if="savedFormExists"
              class="restore-saved-form-button"
              @clicked="restoreSavedForm('filplus_application')">
              {{ restoreSavedFormButtonText }}
            </ButtonA>
          </div>

          <FieldContainer
            :scaffold="formScaffold.organization_name"
            field-key="organization_name"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.data_owner_region"
            field-key="data_owner_region"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.data_owner_industry"
            field-key="data_owner_industry"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.organization_website"
            field-key="organization_website"
            form-id="filplus_application" />

        </div>
      </div>

      <div class="grid zindex-descend-col">
        <div class="col-6_md-6_ti-7" data-push-left="off-1_ti-0">
          <FieldContainer
            :scaffold="formScaffold.organization_social_media_handle"
            field-key="organization_social_media_handle"
            form-id="filplus_application" />
        </div>
        <div class="col-2_md-3_ti-4" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold.organization_social_media_handle_type"
            field-key="organization_social_media_handle_type"
            form-id="filplus_application" />
        </div>
      </div>

      <div class="grid zindex-descend-col">
        <div class="col-6_md-6_ti-7" data-push-left="off-1_ti-0">
          <FieldContainer
            :scaffold="formScaffold.total_datacap_size_input"
            field-key="total_datacap_size_input"
            form-id="filplus_application" />
        </div>
        <div class="col-2_md-3_ti-4" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold.total_datacap_size_unit"
            field-key="total_datacap_size_unit"
            form-id="filplus_application" />
        </div>
      </div>

      <div class="grid zindex-descend-col">
        <div class="col-6_md-6_ti-7" data-push-left="off-1_ti-0">
          <FieldContainer
            :scaffold="formScaffold.weekly_data_size"
            field-key="weekly_data_size"
            form-id="filplus_application" />
        </div>
        <div class="col-2_md-3_ti-4" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold.weekly_data_size_unit"
            field-key="weekly_data_size_unit"
            form-id="filplus_application" />
        </div>
      </div>

      <div class="grid">
        <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

          <FieldContainer
            :scaffold="formScaffold.filecoin_address"
            field-key="filecoin_address"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.custom_multisig"
            field-key="custom_multisig"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.application_data_type"
            field-key="application_data_type"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.identifier"
            field-key="identifier"
            form-id="filplus_application" />

        </div>
      </div>

    </div>

    <!-- ================================================ [Application] Full -->
    <div id="application-bottom">

      <Squigglie
        :percent-left="90"
        :thick="true"
        orientation="up"
        color="nandor"
        class="section-app-top-border" />

      <div class="grid zindex-descend-12">
        <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

          <div class="form-heading-2">
            {{ formHeading2 }}
          </div>

          <FieldContainer
            :scaffold="formScaffold.about"
            field-key="about"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.ecosystem_associates_radio"
            field-key="ecosystem_associates_radio"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.ecosystem_associates_textarea"
            field-key="ecosystem_associates_textarea"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.nature_of_data"
            field-key="nature_of_data"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.source_of_data_select"
            field-key="source_of_data_select"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.source_of_data_textarea"
            field-key="source_of_data_textarea"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.data_preparation_plan_select"
            field-key="data_preparation_plan_select"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.data_preparation_plan_textarea"
            field-key="data_preparation_plan_textarea"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.data_sample"
            field-key="data_sample"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.public_availability_radio"
            field-key="public_availability_radio"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.public_availability_textarea"
            field-key="public_availability_textarea"
            form-id="filplus_application" />

        </div>
      </div>

      <div class="grid zindex-descend-10">
        <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

          <FieldContainer
            :scaffold="formScaffold.frequency_of_retrieval"
            field-key="frequency_of_retrieval"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.duration_of_storage"
            field-key="duration_of_storage"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.geographic_distribution"
            field-key="geographic_distribution"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.sending_data"
            field-key="sending_data"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.storage_provider_selection_plan_select"
            field-key="storage_provider_selection_plan_select"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.storage_provider_selection_plan_input"
            field-key="storage_provider_selection_plan_input"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.storage_provider_selection_plan_textarea"
            field-key="storage_provider_selection_plan_textarea"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.replication_plan_select"
            field-key="replication_plan_select"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.replication_plan_textarea"
            field-key="replication_plan_textarea"
            form-id="filplus_application" />

          <HubspotOptInFields />

          <FieldContainer
            :scaffold="formScaffold.confirm_follow_fil_guideline"
            field-key="confirm_follow_fil_guideline"
            form-id="filplus_application" />

          <div class="buttons">
            <div v-if="account">
              <ButtonA
                class="submit-button"
                loader="lda-submit-button"
                @clicked="submitForm">
                {{ submitButtonText }}
              </ButtonA>
            </div>

            <AuthButton v-else />

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
import ButtonX from '@/components/buttons/button-x'
import HubspotOptInFields from '@/components/hubspot-opt-in-fields'
import Overlay from '@/components/overlay'
import Squigglie from '@/components/squigglie'
import AuthButton from '@/components/auth-button'
import Chevron from '@/components/icons/chevron'

import ApplyLargePageData from '@/content/pages/apply-large.json'

// ====================================================================== Export
export default {
  name: 'ApplyLargePage',

  components: {
    HeroB,
    FieldContainer,
    ButtonA,
    ButtonX,
    HubspotOptInFields,
    Overlay,
    Squigglie,
    AuthButton,
    Chevron
  },

  meta: {
    authenticate: true
  },

  data () {
    return {
      tag: 'apply-large'
    }
  },

  async fetch ({ app, store }) {
    await store.dispatch('general/getBaseData', { key: 'apply-large', data: ApplyLargePageData })
    await store.dispatch('general/getNetworkStorageCapacity')
    const application = await store.dispatch('account/setHubspotOptInData', store.getters['auth/account'])
    await app.$form('filplus_application').register(application)
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      networkStorageCapacity: 'general/networkStorageCapacity',
      savedFormExists: 'form/savedFormExists',
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
    restoreSavedFormButtonText () {
      return this.form.restore_saved_form_button_text
    },
    submitButtonText () {
      return this.form.submit_button_text
    },
    githubIssueLinkText () {
      return this.form.github_issue_link_text
    },
    submitThresholdBottom () {
      return this.generalPageData.forms.submit_threshold_bottom
    },
    submitThresholdMiddle () {
      return this.generalPageData.forms.submit_threshold_middle
    },
    submitThresholdTop () {
      return this.generalPageData.forms.submit_threshold_top
    }
  },

  methods: {
    ...mapActions({
      validateForm: 'form/validateForm',
      submitApplication: 'account/submitApplication',
      restoreSavedForm: 'form/restoreSavedForm'
    }),
    async submitForm () {
      const bottom = this.submitThresholdBottom
      const middle = this.submitThresholdMiddle
      const top = this.submitThresholdTop
      const inputField = this.$field('total_datacap_size_input|filplus_application').get()
      const unitField = this.$field('total_datacap_size_unit|filplus_application').get()
      const bytes = this.$convertSizeToBytes(inputField.value, unitField.scaffold.options[unitField.value].label)
      const pass = await this.$handleFormRedirection(bytes, bottom, top)
      if (!pass && bytes > top) {
        const inputFieldElement = document.querySelector('#total_datacap_size_input')
        this.$scrollToElement(inputFieldElement, 250, -200)
      } else if (pass) {
        if (bytes < middle) {
          this.$button('lda-submit-button').set({ loading: false })
          this.$toaster.add({
            type: 'toast',
            category: 'error',
            message: 'Please fill out the General Application for your requested amount (< 100 TiB)'
          })
          this.$router.push('/apply/general/notaries')
        } else {
          const application = await this.$form('filplus_application').validate()
          if (!application) {
            const firstInvalidField = document.querySelector('.error')
            this.$button('lda-submit-button').set({ loading: false })
            this.$scrollToElement(firstInvalidField, 250, -200)
          } else {
            const success = await this.submitApplication({ application, type: 'lda' })
            if (success) {
              this.$router.push('/apply/success')
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-apply-large {
  position: relative;
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
  [class~=grid], [class*=grid-], [class*=grid_] {
    @include descendingZindex(5);
  }
}

.buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  .button-x {
    margin-left: 3.125rem;
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

.zindex-descend-col {
  [class~=col], [class*=col-], [class*=col_] {
    @include descendingZindex(2);
  }
}

.zindex-descend-5 {
  .field-container {
    @include descendingZindex(5);
  }
}

.zindex-descend-12 {
  .field-container {
    @include descendingZindex(12);
  }
}

.zindex-descend-10 {
  .field-container {
    @include descendingZindex(10);
  }
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

.restore-saved-form-button {
  position: absolute;
  top: 50%;
  left: calc(100% + 1rem);
  transform: translateY(-50%);
}

.field-container {
  margin-bottom: 3.5rem;
}
</style>
