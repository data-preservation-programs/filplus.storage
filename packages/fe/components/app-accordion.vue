<template>
  <div class="applications-accordion">
    <!--
    <ButtonX
      class="expand-all-button"
      @clicked="expandAllAccordionSections">
      {{ toggleButtonText }}
    </ButtonX> -->

    <div class="accordion-wrapper">

      <Accordion
        ref="accordion"
        v-slot="{ active }"
        :multiple="true"
        @toggleStateChanged="accordionToggleStateChanged">

        <AccordionSection
          v-for="(entry, index) in entries"
          :key="index"
          :class="`application-${entry.state}`"
          :active="active">

          <AccordionHeader>
            <div class="header-title-wrapper">
              <IconApplicationOpen />
              <h2 class="header-title h5" v-html="entry.title" />
            </div>
            <h3 class="header-subtitle p1" v-html="constructApplicationSubtitle(entry)" />
            <span class="p2 expand-application-text">
              <IconChevron />
              <span v-html="expandApplicationText" />
              <ButtonX
                :to="entry.html_url"
                tag="a"
                target="_blank"
                theme="green">
                {{ viewOnGithubText }}
              </ButtonX>
            </span>
          </AccordionHeader>

          <AccordionContent>
            <div class="application-body markdown-user-input" v-html="parseApplicationMarkdown(entry.body)" />
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

// import GithubIcon from '@/components/icons/github'
import IconChevron from '@/components/icons/chevron'
import IconApplicationOpen from '@/components/icons/application-open'

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
    // GithubIcon,
    IconChevron,
    IconApplicationOpen,
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
      const issueUser = application.user
      const issueNumber = application.number
      const timeAgo = this.$timeago(new Date(application.created_at))
      const user = issueUser.name || issueUser.login
      return this.applicationSubtitle.replace('|issue_number|', issueNumber).replace('|time_ago|', timeAgo).replace('|user|', user)
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
    }
  }

}
</script>

<style lang="scss" scoped>
// /////////////////////////////////////////////////////////////////// Accordion
.accordion {
  margin-bottom: 11rem;
  position: relative;
}

.accordion-section {
  border: 3px solid $nandor;
  border-bottom: none;
  border-radius: toRem(10) toRem(10) toRem(7) toRem(7);
  padding: 0 1.25rem 0 3.875rem;
  margin-bottom: toRem(18);
  overflow: clip;
  overflow-clip-margin: 3px;
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

.header-title-wrapper {
  display: flex;
  align-items: center;
}

.header-title {
  letter-spacing: 0;
}

.icon-application-open {
  margin-right: 1.25rem;
  margin-left: -2.5rem;
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

.accordion-content {
  padding-top: .25rem;
}

.application-body {
  @include p2;
  padding-bottom: 2.375rem;
  :deep(p) {
    font-size: inherit;
    line-height: inherit;
    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }
  }
}
</style>
