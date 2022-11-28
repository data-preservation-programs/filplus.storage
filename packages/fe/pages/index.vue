<template>
  <div :class="`page page-${tag} container`">

    <ButtonA
      class="expand-all-button"
      @clicked="expandAllAccordionSections">
      {{ accordionToggleButtonText }}
    </ButtonA>

    <Accordion
      ref="accordion"
      v-slot="{ active }"
      :multiple="true"
      @toggleStateChanged="accordionToggleStateChanged">
      <AccordionSection
        v-for="(entry, index) in faq"
        :key="index"
        :active="active">

        <AccordionHeader>
          <div class="question">
            {{ entry.question }}
          </div>
        </AccordionHeader>

        <AccordionContent>
          <div class="anser">
            {{ entry.answer }}
          </div>
        </AccordionContent>

      </AccordionSection>
    </Accordion>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import ButtonA from '@/components/buttons/button-a'
import Accordion from '@/components/accordion/accordion'
import AccordionHeader from '@/components/accordion/accordion-header'
import AccordionContent from '@/components/accordion/accordion-content'
import AccordionSection from '@/components/accordion/accordion-section'

import IndexPageData from '@/content/pages/index.json'
import FaqPageData from '@/content/pages/faq.json'

// ====================================================================== Export
export default {
  name: 'IndexPage',

  components: {
    ButtonA,
    Accordion,
    AccordionHeader,
    AccordionContent,
    AccordionSection
  },

  data () {
    return {
      tag: 'index',
      entireAccordionExpanded: false
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
      return this.faqPageData.faq
    },
    accordionToggleButtonText () {
      const buttonText = this.faqPageData.accordion_button_toggle_text
      if (this.entireAccordionExpanded) { return buttonText.collapse }
      return buttonText.expand
    }
  },

  methods: {
    accordionToggleStateChanged (toggleState) {
      if (toggleState.open === toggleState.total) {
        this.entireAccordionExpanded = true
      } else {
        this.entireAccordionExpanded = false
      }
    },
    expandAllAccordionSections () {
      this.$refs.accordion.$emit('expand-all')
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
</style>
