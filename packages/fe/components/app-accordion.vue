<template>
  <div class="applications-accordion">

    <div class="accordion-wrapper">

      <Accordion
        ref="accordion"
        v-slot="{ active }"
        :multiple="true"
        @toggleStateChanged="accordionToggleStateChanged">

        <AccordionSection
          v-for="(entry, index) in entries"
          v-slot="{ id }"
          :key="index"
          :class="`application-${entry.state}`"
          :active="active">

          <AccordionHeader>
            <div class="header-top-row">
              <div class="header-title-wrapper">
                <IconApplicationOpen
                  v-if="entry.state === 'open' "
                  class="application-icon" />
                <IconApplicationRejected
                  v-if="entry.state === 'closed' && entry.state_reason === 'not_planned' "
                  class="application-icon" />
                <IconApplicationAccepted
                  v-if="entry.state === 'closed' && entry.state_reason === 'completed' "
                  class="application-icon" />
                <h2 class="header-title h5" v-html="entry.title" />
              </div>
              <p class="application-type p2" v-html="entry.type" />
            </div>
            <h3 class="header-subtitle p1" v-html="constructApplicationSubtitle(entry)" />
            <span class="expand-application-text p2">
              <IconChevron />
              <span v-html="expandApplicationText" />
              <ButtonX
                :to="entry.html_url"
                tag="a"
                target="_blank"
                theme="green">
                <div class="text" v-html="viewOnGithubText" />
              </ButtonX>
            </span>
          </AccordionHeader>

          <AccordionContent>
            <div class="accordion-content-wrapper">
              <div class="application-body markdown-user-input" v-html="parseApplicationMarkdown(entry.body)" />
              <ButtonX
                class="close-accordion-button"
                @clicked="toggleAccordionClosed(id)">
                <IconCloseAccordion />
              </ButtonX>
            </div>
          </AccordionContent>

          <Squigglie
            :percent-left="85"
            anchor="bottom"
            orientation="up"
            color="nandor"
            :accordion-bottom-border="true" />

        </AccordionSection>

      </Accordion>

    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import Kramed from 'kramed'

import IconChevron from '@/components/icons/chevron'
import IconApplicationOpen from '@/components/icons/application-open'
import IconApplicationRejected from '@/components/icons/application-rejected'
import IconApplicationAccepted from '@/components/icons/application-accepted'
import IconCloseAccordion from '@/components/icons/close-accordion'

import Accordion from '@/components/accordion/accordion'
import AccordionSection from '@/components/accordion/accordion-section'
import AccordionHeader from '@/components/accordion/accordion-header'
import AccordionContent from '@/components/accordion/accordion-content'
import ButtonX from '@/components/buttons/button-x'
import Squigglie from '@/components/squigglie'

// ====================================================================== Export
export default {
  name: 'AppAccordion',

  components: {
    IconChevron,
    IconApplicationOpen,
    IconApplicationRejected,
    IconApplicationAccepted,
    IconCloseAccordion,
    Accordion,
    AccordionSection,
    AccordionHeader,
    AccordionContent,
    ButtonX,
    Squigglie
  },

  props: {
    entries: {
      type: [Array, Object],
      required: true
    },
    expandApplicationText: {
      type: String,
      required: true
    },
    viewOnGithubText: {
      type: String,
      required: true
    },
    applicationSubtitle: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      renderer: false
    }
  },

  computed: {
  },

  methods: {
    constructApplicationSubtitle (application) {
      const issueNumber = application.number
      const status = application.state === 'open' ? 'opened' : application.state_reason === 'completed' ? 'Closed as completed' : 'Closed as not planned'
      const timeAgo = status === 'opened' ? this.$timeago(new Date(application.created_at)) : this.$timeago(new Date(application.closed_at))
      return this.applicationSubtitle.replace('|issue_number|', issueNumber).replace('|status|', status).replace('|time_ago|', timeAgo)
    },
    parseApplicationMarkdown (applicationBody) {
      return Kramed(applicationBody, { renderer: this.renderer })
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
    },
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
    toggleAccordionClosed (id) {
      this.$refs.accordion.$emit('toggle', id)
    }
  }
}
</script>

<style lang="scss" scoped>
// /////////////////////////////////////////////////////////////////// Accordion
.accordion {
  position: relative;
}

.accordion-section {
  border: 3px solid $nandor;
  border-bottom: none;
  border-radius: toRem(10) toRem(10) toRem(7) toRem(7);
  padding: 0 1.25rem 0 3.875rem;
  overflow: clip;
  overflow-clip-margin: 3px;
  &:not(:last-child) {
    margin-bottom: toRem(18);
  }
  &.open {
    .icon-chevron {
      transition: 150ms ease-out;
      transform: rotate(180deg);
    }
  }
}

.accordion-header {
  cursor: pointer;
  padding: 1.25rem 0;
}

.header-top-row {
  display: flex;
  justify-content: space-between;
}

.header-title-wrapper {
  display: flex;
  align-items: flex-start;
}

.header-title {
  padding-right: 2rem;
  letter-spacing: 0;
}

.application-icon {
  width: toRem(18);
  height: toRem(18);
  margin-top: toRem(6);
  margin-right: 1.25rem;
  margin-left: -2.5rem;
}

.application-type {
  white-space: nowrap;
}

.header-subtitle {
  letter-spacing: 0;
  :deep(.highlight) {
    color: $mandysPink;
    letter-spacing: 0;
  }
}

.expand-application-text {
  display: flex;
  font-weight: 500;
}

.icon-chevron {
  width: 1rem;
  transition: 150ms ease-in;
  margin-right: 1.5rem;
  margin-left: 0.125rem;
}

.accordion-content-wrapper {
  display: flex;
}

.close-accordion-button {
  position:sticky;
  width: toRem(28);
  height: toRem(28);
  top: 7.5rem;
  margin-bottom: 1.5rem;
}

.accordion-content {
  padding-top: .25rem;
}

.application-body {
  @include p2;
  padding-bottom: 2.375rem;
  flex: 1;
  :deep(p) {
    font-size: inherit;
    line-height: inherit;
    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }
  }
}
</style>
