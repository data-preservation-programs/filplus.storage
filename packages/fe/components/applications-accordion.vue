<template>
  <div class="applications-accordion">
    <div class="applications-accordion-toolbar">
      <Select
        class="applications-sort-select"
        :field="sortSelectField"
        @updateValue="updateSortSelect" />

      <ButtonX
        class="expand-all-button"
        @clicked="expandAllAccordionSections">
        {{ toggleButtonText }}
      </ButtonX>
    </div>

    <div class="accordion-wrapper">

      <Squigglie
        :percent-left="16"
        orientation="up"
        color="white"
        class="applications-top-border" />

      <Accordion
        ref="accordion"
        v-slot="{ active }"
        :multiple="true"
        @toggleStateChanged="accordionToggleStateChanged">
        <AccordionSection
          v-for="(entry, index) in sortedApplications"
          :key="index"
          :class="`application-${entry.state}`"
          :active="active">

          <AccordionHeader>
            <div class="application-title">
              <span class="text" v-html="entry.title" />
              <IconChevron />
            </div>
          </AccordionHeader>

          <AccordionContent>
            <MarkdownParser class="application-body" :markdown="entry.body" />
          </AccordionContent>

        </AccordionSection>
      </Accordion>

      <Squigglie
        :percent-left="84"
        orientation="down"
        anchor="bottom"
        color="white"
        class="applications-top-border" />

    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import Select from '@/components/form/fields/select'
import ButtonX from '@/components/buttons/button-x'
import Accordion from '@/components/accordion/accordion'
import AccordionHeader from '@/components/accordion/accordion-header'
import AccordionContent from '@/components/accordion/accordion-content'
import AccordionSection from '@/components/accordion/accordion-section'
import Squigglie from '@/components/squigglie'
import MarkdownParser from '@/components/markdown-parser'

import IconChevron from '@/components/icons/chevron'

// ====================================================================== Export
export default {
  name: 'ApplicationAccordion',

  components: {
    ButtonX,
    Accordion,
    AccordionHeader,
    AccordionContent,
    AccordionSection,
    IconChevron,
    Squigglie,
    MarkdownParser,
    Select
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
      entireAccordionExpanded: false,
      sortSelectValue: 0
    }
  },

  computed: {
    toggleButtonText () {
      const buttonText = this.toggleButtonContent
      if (this.entireAccordionExpanded) { return buttonText.collapse }
      return buttonText.expand
    },
    sortedApplications () {
      const applications = [...this.entries]
      switch (this.sortSelectValue) {
        case 1: // newest first
          return applications.sort((a, b) => {
            return a.created_at > b.created_at ? -1 : 1
          })
        default: // open first
          return applications.sort((a, b) => {
            if (a.state === b.state) {
              return a.created_at > b.created_at ? -1 : 1
            } else {
              return a.state > b.state ? -1 : 1
            }
          })
      }
    },
    sortSelectField () {
      return {
        id: 'application_sort_select|applications_accordion',
        scaffold: {
          type: 'select',
          modelKey: 'application_sort_select',
          label: '',
          required: true,
          output: 'option',
          react: {
            fieldKey: 'application_sort_select',
            func: '$selectOption',
            args: {
              value_from_field: 'application_sort_select'
            }
          },
          options: [
            { label: 'Open first' },
            { label: 'Newest first' }
          ],
          defaultValue: 0
        },
        value: this.sortSelectValue
      }
    }
  },

  mounted () {
    if (this.$route.query.sort) {
      switch (this.$route.query.sort) {
        case 'newest':
          this.sortSelectValue = 1
          break
        default:
          this.sortSelectValue = 0
      }
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
    },
    updateSortSelect (value) {
      switch (value) {
        case 1:
          this.sortSelectValue = 1
          this.$router.push({ path: this.$route.path, query: { sort: 'newest' } })
          break
        default: // default sort is open issues first
          this.sortSelectValue = 0
          this.$router.push({ path: this.$route.path, query: { sort: 'open' } })
      }
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
.applications-accordion {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.applications-accordion-toolbar {
  display: flex;
  flex-direction: row;
  margin: 1rem 0;
}

.applications-sort-select {
  width: 12rem;
  position: relative;
  margin-right: 1rem;
}

.expand-all-button {
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

.application-open {
  color: green;
}

.application-closed {
  color: red;
}

.accordion-header {
  padding: $padding 0;
  cursor: pointer;
  &:hover {
    .application-title {
      text-decoration: underline;
    }
  }
}

.application-title {
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

.application-body {
  padding-bottom: $padding;
  @include mini {
    font-size: toRem(14);
    line-height: leading(25, 14);
  }
  :deep(a) {
    color: $greenYellow;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
