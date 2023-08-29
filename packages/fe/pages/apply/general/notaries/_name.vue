<template>
  <div :class="`page page-${tag}`">

    <!-- ============================================================== Hero -->
    <HeroB
      :label="hero.label"
      :heading="heroHeading"
      :hero-button="backButton"
      :kyc-heading="kycHeading" />

    <div id="form">

      <!-- ===================================================== Application -->
      <div id="application">

        <Squigglie
          :percent-left="10"
          orientation="down"
          color="nandor"
          :thick="true"
          class="section-app-top-border" />

        <div class="grid z-index-100">
          <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

            <div class="form-heading">
              <span>{{ formHeading }}</span>
            </div>

            <Field :scaffold="notariesFormScaffold" />

            <FieldContainer :scaffold="formScaffold.data_owner_name" />

            <HubspotOptInFields />

            <FieldContainer :scaffold="formScaffold.website" />

            <FieldContainer :scaffold="formScaffold.ga_region" />

          </div>
        </div>

        <div class="grid z-index-50">
          <div class="col-6_md-6_ti-7 z-index-100" data-push-left="off-1_ti-0">
            <FieldContainer :scaffold="formScaffold.social_media_handle" />
          </div>
          <div class="col-2_md-3_ti-4" data-push-left="off-1">
            <FieldContainer :scaffold="formScaffold.social_media_handle_type" />
          </div>
        </div>

        <div class="grid z-index-50">
          <div class="col-6_md-6_ti-7 z-index-100" data-push-left="off-1_ti-0">
            <FieldContainer :scaffold="formScaffold.total_datacap_size_input" />
          </div>
          <div class="col-2_md-3_ti-4" data-push-left="off-1">
            <FieldContainer :scaffold="formScaffold.total_datacap_size_unit" />
          </div>
        </div>

        <div class="grid">
          <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

            <FieldContainer :scaffold="formScaffold.filecoin_address" />

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

    </div>

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
import Field from '@/modules/form/components/field'
import ButtonA from '@/components/buttons/button-a'
import ButtonX from '@/components/buttons/button-x'
import HubspotOptInFields from '@/components/hubspot-opt-in-fields'
import Overlay from '@/components/overlay'
import Squigglie from '@/components/squigglie'
import LoginButton from '@/components/navigation/button-login'
import Chevron from '@/components/icons/chevron'

import ApplyGeneralPageData from '@/content/pages/apply-general.json'
import NotariesPageData from '@/content/pages/notaries.json'

// ====================================================================== Export
export default {
  name: 'ApplyGeneralPage',

  components: {
    HeroB,
    FormToolbar,
    FieldContainer,
    Field,
    ButtonA,
    ButtonX,
    HubspotOptInFields,
    Overlay,
    Squigglie,
    LoginButton,
    Chevron
  },

  asyncData ({ app, params }) {
    const notaryField = app.$field.get('total_datacap_size_input')
    return {
      /**
       * If navigating from anywhere but the notaries page, need to add a hidden
       * 'notary' field and pre-populate it with the notary name from the URL.
       */
      notariesFormScaffold: Object.assign(NotariesPageData.page_content.form.scaffold.notary, {
        defaultValue: notaryField ? notaryField.value : params.name
      })
    }
  },

  data () {
    return {
      tag: 'apply-general',
      notariesFormScaffold: {}
    }
  },

  async fetch ({ app, store, params, redirect }) {
    const name = params.name
    const notariesList = await store.dispatch('general/getCachedFile', 'notaries-list.json')
    const notary = notariesList.find(notary => notary.name === name || notary.organization === name)
    if (!notary) { return redirect('/apply/general/notaries') }
    await store.dispatch('account/setHubspotOptInData', store.getters['auth/account'])
    await store.dispatch('general/getBaseData', { key: 'apply-general', data: ApplyGeneralPageData })
    await store.dispatch('form/registerModel', { id: 'filplus_application', data: store.getters['account/application'] })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
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
      return this.hero.heading.replace('|notary|', this.$route.params.name)
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
    formHeading () {
      return this.form.heading
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
      if (!pass) {
        const firstInvalidField = document.querySelector('.field.error')
        this.$scrollToElement(firstInvalidField, 250, -200)
        this.$button('application-submit-button').set({ loading: false })
        return
      }
      const inputField = this.$field.get('total_datacap_size_input')
      const unitField = this.$field.get('total_datacap_size_unit')
      const bytes = this.$convertSizeToBytes(inputField.value, unitField.scaffold.options[unitField.value].label)
      const thresholds = this.formsThresholds
      const stay = await this.$handleFormRedirection(bytes, 'stage-ga', thresholds)
      if (pass && stay) {
        const application = await this.$form.applyFormToSchema('filplus_application', this.application, true)
        await this.submitApplication({ application, bytes, thresholds })
      }
      this.$button('application-submit-button').set({ loading: false })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-apply-general {
  overflow: hidden;
}

:deep(#hero) {
  .highlight {
    display: block;
    margin-top: 0.5rem;
  }
}

#form {
  position: relative;
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

.field-container {
  margin-bottom: 3.5rem;
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
</style>
