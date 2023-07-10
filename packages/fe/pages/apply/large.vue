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

    <!-- ============================== [Application] Background Information -->
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
            <ButtonA
              v-if="savedFormExists"
              class="restore-saved-form-button"
              @clicked="restoreSavedForm('filplus_application')">
              {{ restoreSavedFormButtonText }}
            </ButtonA>
          </div>

          <FieldContainer
            :scaffold="formScaffold['Data Owner Name']"
            field-key="Data Owner Name"
            form-id="filplus_application" />

          <HubspotOptInFields />

          <FieldContainer
            :scaffold="formScaffold['What is your role related to the dataset']"
            field-key="What is your role related to the dataset"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['Data Owner Country/Region']"
            field-key="Data Owner Country/Region"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['Data Owner Industry']"
            field-key="Data Owner Industry"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['Website']"
            field-key="Website"
            form-id="filplus_application" />

        </div>
      </div>

      <div class="grid">
        <div class="col-6_md-6_ti-7" data-push-left="off-1_ti-0">
          <FieldContainer
            :scaffold="formScaffold['Social Media||handle']"
            field-key="Social Media||handle"
            form-id="filplus_application" />
        </div>
        <div class="col-2_md-3_ti-4" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold['Social Media||type']"
            field-key="Social Media||type"
            form-id="filplus_application" />
        </div>
      </div>

      <div class="grid">
        <div class="col-6_md-6_ti-7" data-push-left="off-1_ti-0">
          <FieldContainer
            :scaffold="formScaffold['Total amount of DataCap being requested||amount']"
            field-key="Total amount of DataCap being requested||amount"
            form-id="filplus_application" />
        </div>
        <div class="col-2_md-3_ti-4" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold['Total amount of DataCap being requested||unit']"
            field-key="Total amount of DataCap being requested||unit"
            form-id="filplus_application" />
        </div>
      </div>

      <div class="grid">
        <div class="col-6_md-6_ti-7" data-push-left="off-1_ti-0">
          <FieldContainer
            :scaffold="formScaffold['Expected size of single dataset (one copy)||amount']"
            field-key="Expected size of single dataset (one copy)||amount"
            form-id="filplus_application" />
        </div>
        <div class="col-2_md-3_ti-4" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold['Expected size of single dataset (one copy)||unit']"
            field-key="Expected size of single dataset (one copy)||unit"
            form-id="filplus_application" />
        </div>
        <div class="col-6_md-6_ti-7" data-push-left="off-1_ti-0">
          <FieldContainer
            :scaffold="formScaffold['Number of replicas to store']"
            field-key="Number of replicas to store"
            form-id="filplus_application" />
        </div>
      </div>

      <div class="grid">
        <div class="col-6_md-6_ti-7" data-push-left="off-1_ti-0">
          <FieldContainer
            :scaffold="formScaffold['Weekly allocation of DataCap requested||amount']"
            field-key="Weekly allocation of DataCap requested||amount"
            form-id="filplus_application" />
        </div>
        <div class="col-2_md-3_ti-4" data-push-left="off-1">
          <FieldContainer
            :scaffold="formScaffold['Weekly allocation of DataCap requested||unit']"
            field-key="Weekly allocation of DataCap requested||unit"
            form-id="filplus_application" />
        </div>
      </div>

      <div class="grid">
        <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

          <FieldContainer
            :scaffold="formScaffold['On-chain address for first allocation']"
            field-key="On-chain address for first allocation"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['Custom multisig']"
            field-key="Custom multisig"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['Data Type of Application']"
            field-key="Data Type of Application"
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

      <div class="grid">
        <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

          <div class="form-heading-2">
            {{ formHeading2 }}
          </div>

          <FieldContainer
            :scaffold="formScaffold['Share a brief history of your project and organization']"
            field-key="Share a brief history of your project and organization"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['Is this project associated with other projects/ecosystem stakeholders?']"
            field-key="Is this project associated with other projects/ecosystem stakeholders?"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['If answered yes, what are the other projects/ecosystem stakeholders']"
            field-key="If answered yes, what are the other projects/ecosystem stakeholders"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['Describe the data being stored onto Filecoin']"
            field-key="Describe the data being stored onto Filecoin"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['Where was the data currently stored in this dataset sourced from']"
            field-key="Where was the data currently stored in this dataset sourced from"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['If you answered \'Other\' in the previous question, enter the details here']"
            field-key="If you answered 'Other' in the previous question, enter the details here"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['How do you plan to prepare the dataset']"
            field-key="How do you plan to prepare the dataset"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['If you answered \'other/custom tool\' in the previous question, enter the details here']"
            field-key="If you answered 'other/custom tool' in the previous question, enter the details here"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['Please share a sample of the data (a link to a file, an image, a table, etc., are good ways to do this.)']"
            field-key="Please share a sample of the data (a link to a file, an image, a table, etc., are good ways to do this.)"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['Confirm that this is a public dataset that can be retrieved by anyone on the network (i.e., no specific permissions or access rights are required to view the data)']"
            field-key="Confirm that this is a public dataset that can be retrieved by anyone on the network (i.e., no specific permissions or access rights are required to view the data)"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['If you chose not to confirm, what was the reason']"
            field-key="If you chose not to confirm, what was the reason"
            form-id="filplus_application" />

        </div>
      </div>

      <div class="grid">
        <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

          <FieldContainer
            :scaffold="formScaffold['What is the expected retrieval frequency for this data']"
            field-key="What is the expected retrieval frequency for this data"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['For how long do you plan to keep this dataset stored on Filecoin']"
            field-key="For how long do you plan to keep this dataset stored on Filecoin"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['In which geographies do you plan on making storage deals']"
            field-key="In which geographies do you plan on making storage deals"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['How will you be distributing your data to storage providers']"
            field-key="How will you be distributing your data to storage providers"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['How do you plan to choose storage providers']"
            field-key="How do you plan to choose storage providers"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['If you answered \'Other\' in the previous question, what is the tool or platform you plan to use']"
            field-key="If you answered 'Other' in the previous question, what is the tool or platform you plan to use"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['If you already have a list of storage providers to work with, fill out their names and provider IDs below']"
            field-key="If you already have a list of storage providers to work with, fill out their names and provider IDs below"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['How do you plan to make deals to your storage providers']"
            field-key="How do you plan to make deals to your storage providers"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['If you answered \'Others/custom tool\' in the previous question, enter the details here']"
            field-key="If you answered 'Others/custom tool' in the previous question, enter the details here"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold['Can you confirm that you will follow the Fil+ guideline (Data owner should engage at least 4 SPs and no single SP ID should receive >30% of a client\'s allocated DataCap)']"
            field-key="Can you confirm that you will follow the Fil+ guideline (Data owner should engage at least 4 SPs and no single SP ID should receive >30% of a client's allocated DataCap)"
            form-id="filplus_application" />

          <div class="buttons">
            <div v-if="account">
              <ButtonA
                class="submit-button"
                loader="application-submit-button"
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

  data () {
    return {
      tag: 'apply-large'
    }
  },

  async fetch ({ app, store }) {
    await store.dispatch('general/getBaseData', { key: 'apply-large', data: ApplyLargePageData })
    await store.dispatch('general/getNetworkStorageCapacity')
    await store.dispatch('account/getApplicationSchema')
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
    restoreSavedFormButtonText () {
      return this.form.restore_saved_form_button_text
    },
    submitButtonText () {
      return this.form.submit_button_text
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
      submitApplication: 'account/submitApplication',
      restoreSavedForm: 'form/restoreSavedForm'
    }),
    async submitForm () {
      const inputField = this.$field('Total amount of DataCap being requested||amount|filplus_application').get()
      const unitField = this.$field('Total amount of DataCap being requested||unit|filplus_application').get()
      const bytes = this.$convertSizeToBytes(inputField.value, unitField.scaffold.options[unitField.value].label)
      const thresholds = this.formsThresholds
      const pass = await this.$handleFormRedirection(bytes, 'stage-lda', thresholds)
      if (pass) {
        const application = await this.$form('filplus_application').validate()
        if (!application) {
          const firstInvalidField = document.querySelector('.error')
          this.$scrollToElement(firstInvalidField, 250, -200)
        } else {
          await this.submitApplication({ application, bytes, thresholds })
        }
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
