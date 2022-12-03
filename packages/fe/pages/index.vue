<template>
  <div :class="`page page-${tag} container`">

    <Hero />

    <div class="grid">
      <div class="col">

        <FaqAccordion
          :entries="faq"
          :toggle-button-content="accordionToggleButtonText" />

      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Hero from '@/components/hero'
import FaqAccordion from '@/components/faq-accordion'

import IndexPageData from '@/content/pages/index.json'
import FaqPageData from '@/content/pages/faq.json'

// ====================================================================== Export
export default {
  name: 'IndexPage',

  components: {
    Hero,
    FaqAccordion
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
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
</style>
