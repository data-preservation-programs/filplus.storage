<template>
  <div class="faq-accordion">

    <ButtonX
      class="expand-all-button"
      @clicked="expandAllAccordionSections">
      {{ toggleButtonText }}
    </ButtonX>

    <div class="accordion-wrapper">

      <Squigglie
        :percent-left="16"
        orientation="up"
        color="white"
        class="faq-top-border" />

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
              <span class="text">{{ entry.question }}</span>
              <IconChevronDown />
            </div>
          </AccordionHeader>

          <AccordionContent>
            <div class="answer">
              {{ entry.answer }}
            </div>
          </AccordionContent>

        </AccordionSection>
      </Accordion>

      <Squigglie
        :percent-left="84"
        orientation="down"
        anchor="bottom"
        color="white"
        class="faq-top-border" />

    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import ButtonX from '@/components/buttons/button-x'
import Accordion from '@/components/accordion/accordion'
import AccordionHeader from '@/components/accordion/accordion-header'
import AccordionContent from '@/components/accordion/accordion-content'
import AccordionSection from '@/components/accordion/accordion-section'
import Squigglie from '@/components/squigglie'

import IconChevronDown from '@/components/icons/chevron-down'

// ====================================================================== Export
export default {
  name: 'FaqAccordion',

  components: {
    ButtonX,
    Accordion,
    AccordionHeader,
    AccordionContent,
    AccordionSection,
    IconChevronDown,
    Squigglie
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
$padding: 2.25rem;

@mixin border {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: $titanWhite;
}

// ///////////////////////////////////////////////////////////////////// General
.faq-accordion {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.expand-all-button {
  margin-bottom: 1.5rem;
  :deep(.button) {
    font-size: toRem(18);
  }
}

.accordion-wrapper {
  position: relative;
}

.accordion-section {
  &:first-child {
    &:before {
      bottom: auto;
      top: 0;
    }
  }
  &.open {
    .icon-chevron-down {
      transition: 150ms ease-out;
      transform: rotate(-180deg);
    }
  }
  &:last-child {
    .accordion-content {
      &:before {
        display: none;
      }
    }
  }
}

.accordion-header {
  padding: $padding 0;
}

.question {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  font-size: toRem(24);
  line-height: leading(35, 24);
  @include mini {
    font-size: toRem(16);
    line-height: leading(35, 16);
  }
  .text {
    padding-right: 1rem;
  }
}

.icon-chevron-down {
  width: 1rem;
  margin-top: 1rem;
  transition: 150ms ease-in;
}

.accordion-content {
  &:before {
    @include border;
  }
}

.answer {
  padding-bottom: $padding;
  @include mini {
    font-size: toRem(14);
    line-height: leading(25, 14);
  }
}
</style>
