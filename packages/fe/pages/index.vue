<template>
  <div :class="`page page-${tag} container`">

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

import FaqAccordion from '@/components/faq-accordion'

import IndexPageData from '@/content/pages/index.json'
import FaqPageData from '@/content/pages/faq.json'

// ====================================================================== Export
export default {
  name: 'IndexPage',

  components: {
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
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
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
