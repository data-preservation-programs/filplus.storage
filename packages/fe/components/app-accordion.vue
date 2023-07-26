<template>
  <div class="applications-accordion">

    <div class="accordion-wrapper">

      <Accordion
        ref="accordion"
        v-slot="{ active }"
        :multiple="true"
        @toggleStateChanged="accordionToggleStateChanged">

        <AccordionSection
          v-for="entry in entries"
          v-slot="{ id }"
          :key="entry.id"
          :class="`application-${entry.state}`"
          :active="active">

          <AccordionHeader>
            <div class="state-icon-wrapper">
              <IconApplicationOpen
                v-if="entry.state === 'open'"
                class="state-icon" />
              <IconApplicationRejected
                v-if="entry.state === 'closed' && entry.state_reason === 'not_planned'"
                class="state-icon" />
              <IconApplicationAccepted
                v-if="entry.state === 'closed' && entry.state_reason === 'completed'"
                class="state-icon" />
            </div>
            <div class="header-content">
              <div class="panel-left">
                <h2 class="header-title h5" v-html="entry.title" />
                <Timeago
                  v-slot="{ convertedDate }"
                  :date="getDate(entry)">
                  <h3 class="header-subtitle p1" v-html="generateSubtitle(entry, convertedDate)" />
                </Timeago>
              </div>
              <div class="panel-right">
                <div class="application-type p2" v-html="entry.type" />
                <div :class="['application-progress', entry.application_state]">
                  <span
                    v-for="(value, key) in stateMap"
                    :key="`application-progress-state-${key}`"
                    :class="['step', key, { highlight: key === entry.application_state }]" />
                </div>
                <div class="application-state">
                  {{ stateMap[entry.application_state] }}
                </div>
              </div>
            </div>
            <div class="expand-application-text p2">
              <IconChevron />
              <span v-html="expandApplicationText" />
              <ButtonX
                :to="entry.html_url"
                tag="a"
                target="_blank"
                theme="green">
                <div class="text" v-html="viewOnGithubText" />
              </ButtonX>
            </div>
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
import Timeago from '@/components/timeago'
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
    Timeago,
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
      renderer: false,
      stateMap: {
        noRelevantLabels: 'Not Started',
        reviewing: 'In Review',
        validated: 'Validated',
        completed: 'Completed'
      }
    }
  },

  methods: {
    getDate (application) {
      const status = this.getStatus(application)
      return new Date(status === 'opened' ? application.created_at : application.closed_at)
    },
    getStatus (application) {
      const open = application.state === 'open'
      let status = 'opened'
      if (!open) {
        status = application.state_reason === 'completed' ? 'Closed as completed' : 'Closed as not planned'
      }
      return status
    },
    generateSubtitle (application, timeago) {
      const issueNumber = application.number
      const status = this.getStatus(application)
      return this.applicationSubtitle.replace('|issue_number|', issueNumber).replace('|status|', status).replace('|time_ago|', timeago)
    },
    parseApplicationMarkdown (applicationBody) {
      return applicationBody ? Kramed(applicationBody, { renderer: this.renderer }) : ''
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
  position: relative;
  cursor: pointer;
  padding: 1.25rem 0;
}

.state-icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  left: -3.875rem;
  width: 3.875rem;
  padding-top: toRem(26);
}

.state-icon {
  width: toRem(18);
  height: toRem(18);
}

.header-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.header-title {
  padding-right: 2rem;
  letter-spacing: 0;
}

.panel-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.application-type {
  white-space: nowrap;
}

@mixin applicationProgressStepHighlighted {
  background-color: $greenYellow;
  color: $aztec;
  border-color: $greenYellow;
}

.application-progress {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.5rem 0;
  .step {
    @include applicationProgressStepHighlighted;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 1px solid;
    transition: 150ms ease-in;
    &:not(:first-child) {
      margin-left: calc(#{toRem(19)} + #{toRem(3 * 2)});
      &:before {
        display: block;
        content: '';
        position: absolute;
        top: toRem(5);
        right: calc(100% + #{toRem(4)});
        width: toRem(19);
        height: toRem(3);
        border-radius: toRem(3);
        background-color: $nandor;
      }
    }
    &.noRelevantLabels:after { content: '-'; }
    &.reviewing:after { content: '1'; }
    &.validated:after { content: '2'; }
    &.completed:after { content: '3'; }
    &:after {
      font-size: toRem(9);
      line-height: 1;
    }
    &.highlight ~ * {
      background-color: $aztec;
      border-color: $nandor;
      color: white;
    }
  }
}

.application-state {
  font-size: toRem(14);
  line-height: 1;
  color: $greenYellow;
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
  position: sticky;
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
