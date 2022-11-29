<template>
  <div class="faq-accordion">

    <div class="grid">
      <div class="col">

        <ButtonA
          class="expand-all-button"
          @clicked="expandAllAccordionSections">
          {{ toggleButtonText }}
        </ButtonA>

        <Accordion
          ref="accordion"
          v-slot="{ active }"
          :multiple="true"
          @toggleStateChanged="accordionToggleStateChanged">
          <AccordionSection
            v-for="(entry, index) in entries"
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
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import ButtonA from '@/components/buttons/button-a'
import Accordion from '@/components/accordion/accordion'
import AccordionHeader from '@/components/accordion/accordion-header'
import AccordionContent from '@/components/accordion/accordion-content'
import AccordionSection from '@/components/accordion/accordion-section'

// ====================================================================== Export
export default {
  name: 'FaqAccordion',

  components: {
    ButtonA,
    Accordion,
    AccordionHeader,
    AccordionContent,
    AccordionSection
  },

  props: {
    entries: {
      type: Array,
      required: true
    },
    toggleButtonContent: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      entireAccordionExpanded: false
    }
  },

  computed: {
    toggleButtonText () {
      const buttonText = this.toggleButtonContent
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
