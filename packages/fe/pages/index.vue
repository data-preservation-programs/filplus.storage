<template>
  <div :class="`page page-${tag} container`">

    <div class="grid">
      <div class="col">

        <FaqAccordion
          :entries="faq"
          :toggle-button-content="accordionToggleButtonText" />

      </div>
    </div>

    <div class="grid">
      <div class="col">

        <FieldContainer
          :scaffold="formScaffold.datacap_size_range"
          :value="getValue('datacap_size')"
          form-id="datacap_size_selection" />

        <FieldContainer
          :scaffold="formScaffold.datacap_size_input"
          :value="getValue('datacap_size')"
          form-id="datacap_size_selection" />

        <FieldContainer
          :scaffold="formScaffold.datacap_size_unit"
          :value="getValue('datacap_size_unit')"
          form-id="datacap_size_selection" />

        <ButtonA
          class="submit-button"
          @clicked="submitForm">
          Submit
        </ButtonA>

      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import FaqAccordion from '@/components/faq-accordion'
import FieldContainer from '@/components/form/field-container'
import ButtonA from '@/components/buttons/button-a'

import IndexPageData from '@/content/pages/index.json'
import FaqPageData from '@/content/pages/faq.json'

// ====================================================================== Export
export default {
  name: 'IndexPage',

  components: {
    FaqAccordion,
    FieldContainer,
    ButtonA
  },

  data () {
    return {
      tag: 'index'
    }
  },

  async fetch ({ store, route }) {
    await store.dispatch('general/getBaseData', { key: 'index', data: IndexPageData })
    await store.dispatch('general/getBaseData', { key: 'faq', data: FaqPageData })
    const application = store.getters['general/application']
    await store.dispatch('form/registerFormModel', Object.assign(application, {
      formId: 'datacap_size_selection',
      state: 'valid'
    }))
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
      return this.siteContent.index.page_content
    },
    faqPageData () {
      return this.siteContent.faq.page_content
    },
    faq () {
      return this.faqPageData.faq.slice(0, 4)
    },
    accordionToggleButtonText () {
      return this.faqPageData.accordion_button_toggle_text
    },
    formScaffold () {
      return this.pageData.apply_form_scaffold
    }
  },

  methods: {
    ...mapActions({
      validateForm: 'form/validateForm'
    }),
    getValue (modelKey) {
      return this.application[modelKey]
    },
    async submitForm () {
      const incoming = await this.validateForm('datacap_size_selection')
      console.log(incoming)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
</style>
