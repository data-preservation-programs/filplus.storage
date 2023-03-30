<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroB
      :label="hero.label"
      :heading="heroHeading"
      :hero-button="backButton" />

    <!-- ======================================================= Application -->
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
            :scaffold="formScaffold.organization_website"
            field-key="organization_website"
            form-id="filplus_application" />

          <FieldContainer
            :scaffold="formScaffold.ga_region"
            field-key="ga_region"
            form-id="filplus_application" />

        </div>
      </div>

      <div class="grid z-index-50">
        <div class="col-6_md-6_ti-7 z-index-100" data-push-left="off-1_ti-0">
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

      <div class="grid z-index-50">
        <div class="col-6_md-6_ti-7 z-index-100" data-push-left="off-1_ti-0">
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

      <div class="grid">
        <div class="col-6_md-8_sm-10_ti-12" data-push-left="off-1_ti-0">

          <FieldContainer
            :scaffold="formScaffold.filecoin_address"
            field-key="filecoin_address"
            form-id="filplus_application" />

          <HubspotOptInFields />

          <div class="buttons">
            <div v-if="account">
              <ButtonA
                class="submit-button"
                loader="ga-submit-button"
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

import ApplyGeneralPageData from '@/content/pages/apply-general.json'
import NotariesPageData from '@/content/pages/notaries.json'

// ====================================================================== Export
export default {
  name: 'ApplyGeneralPage',

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
      tag: 'apply-general'
    }
  },

  async fetch ({ app, store, params, redirect }) {
    const name = params.name
    const notariesList = await store.dispatch('general/getCachedFile', 'notaries-list.json')
    const notary = notariesList.find(notary => notary.name === name || notary.organization === name)
    if (!notary) { return redirect('/apply/general/notaries') }
    const notaryFieldId = 'notary|filplus_application'
    const notaryField = app.$field(notaryFieldId).get()
    const application = await store.dispatch('account/setHubspotOptInData', store.getters['auth/account'])
    await app.$form('filplus_application').register(application)
    if (!notaryField) {
      await app.$field(notaryFieldId).register(
        'filplus_application',
        false,
        'notary',
        NotariesPageData.page_content.form.scaffold.notary,
        'nullState'
      )
      await app.$field(notaryFieldId).updateValue(name)
    }
    await store.dispatch('general/getBaseData', { key: 'apply-general', data: ApplyGeneralPageData })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
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
      return this.hero.heading.replace('|notary|', this.$route.params.name)
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
        if (bytes >= middle && bytes <= top) {
          this.$button('ga-submit-button').set({ loading: false })
          this.$toaster.add({
            type: 'toast',
            category: 'error',
            message: 'Please fill out the Large Dataset Application for your requested amount (> 100 TiB)'
          })
          this.$router.push('/apply/large')
        } else {
          const application = await this.$form('filplus_application').validate()
          if (!application) {
            const firstInvalidField = document.querySelector('.error')
            this.$button('ga-submit-button').set({ loading: false })
            this.$scrollToElement(firstInvalidField, 250, -200)
          } else {
            await this.submitApplication({ application, type: 'GA' })
          }
        }
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

:deep(#hero) {
  .highlight {
    display: block;
    margin-top: 0.5rem;
  }
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
</style>
