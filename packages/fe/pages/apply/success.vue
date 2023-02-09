<template>
  <div :class="`page page-${tag} container`">

    <!-- =========================================================== Success -->
    <div id="section-success">

      <div class="grid">
        <div class="col-8_mi-10 success" data-push-left="off-1_mi-0" data-push-right="off-1_mi-0">
          <div class="panel-left">

            <h1 class="heading h3" v-html="pageHeading" />

            <div class="buttons">
              <ButtonA
                v-if="githubIssueLink"
                class="github-issue-link-button"
                theme="github"
                tag="a"
                target="_blank"
                :to="githubIssueLink">
                <GithubIcon />
                {{ githubIssueButtonText }}
              </ButtonA>

              <ButtonA
                class="new-application-button"
                theme="green"
                to="/apply"
                tag="nuxt-link"
                target="_blank">
                {{ newApplicationButtonText }}
              </ButtonA>

            </div>

            <Accordion
              ref="accordion"
              v-slot="{ active }"
              :multiple="true"
              @toggleStateChanged="accordionToggleStateChanged">
              <AccordionSection
                :active="active">

                <AccordionHeader>
                  <h2 class="header-title h5">
                    <IconApplicationOpen />
                    {{ applicationTitle }}
                  </h2>
                  <h3 class="header-subtitle p1" v-html="applicationSubtitle" />
                  <IconChevronDown />
                  <span v-html="expandApplicationText" />
                </AccordionHeader>

                <AccordionContent>
                  <div v-if="typeof applicationBody === 'string' ">
                    <MarkdownParser :markdown="applicationBody" />
                  </div>
                </AccordionContent>

              </AccordionSection>
              <Squigglie
                :percent-left="85"
                anchor="bottom"
                orientation="up"
                color="nandor"
                :accordion-bottom-border="true" />

            </Accordion>

          </div>
        </div>

        <div class="col-2_mi-1">
          <div class="panel-right">
            <div class="warp-image-double" />
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import GithubIcon from '@/components/icons/github'
import IconChevronDown from '@/components/icons/chevron-down'
import IconApplicationOpen from '@/components/icons/application-open'

import ButtonA from '@/components/buttons/button-a'
import MarkdownParser from '@/components/markdown-parser'
import Accordion from '@/components/accordion/accordion'
import AccordionSection from '@/components/accordion/accordion-section'
import AccordionHeader from '@/components/accordion/accordion-header'
import AccordionContent from '@/components/accordion/accordion-content'
import Squigglie from '@/components/squigglie'

import ApplySucessPageData from '@/content/pages/apply-success.json'

// ====================================================================== Export
export default {
  name: 'ApplyPage',

  components: {
    GithubIcon,
    IconChevronDown,
    IconApplicationOpen,
    ButtonA,
    MarkdownParser,
    Accordion,
    AccordionSection,
    AccordionHeader,
    AccordionContent,
    Squigglie
  },

  data () {
    return {
      tag: 'apply-success'
    }
  },

  async fetch ({ store }) {
    await store.dispatch('general/getBaseData', { key: 'apply-success', data: ApplySucessPageData })
    await store.dispatch('general/getSubmittedGeneralApplications')
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      githubIssue: 'general/githubIssue',
      submittedGeneralApplications: 'general/submittedGeneralApplications',
      account: 'account/account'
    }),
    generalPageData () {
      return this.siteContent.general
    },
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    pageHeading () {
      return this.pageData.heading.replace('|data|', this.datacapRequested)
    },
    datacapRequested () {
      // needs to be parsed from the markdwon
      return '15.4 EiB'
    },
    subheading () {
      return this.pageData.subheading
    },
    githubIssueLink () {
      // return this.githubIssue.body
      return this.submittedGeneralApplications[0].html_url
    },
    githubIssueButtonText () {
      return this.pageData.github_issue_button_text
    },
    newApplicationButtonText () {
      return this.pageData.new_application_button_text
    },
    applicationTitle () {
      // return this.githubIssue.title
      return this.submittedGeneralApplications[0].title
    },
    applicationSubtitle () {
      // const issueNumber = this.githubIssue.number
      const issueNumber = this.submittedGeneralApplications[0].number
      // const timeAgo = this.$timeago(new Date(this.githubIssue.created_at))
      const timeAgo = this.$timeago(new Date(this.submittedGeneralApplications[0].created_at))
      // const user = this.githubIssue.user.name  ? this.githubIssue.user.name  : this.githubIssue.user.login
      const user = this.submittedGeneralApplications[0].user.name ? this.submittedGeneralApplications[0].user.name : this.submittedGeneralApplications[0].user.login
      return this.pageData.application_subtitle.replace('|issue_number|', issueNumber).replace('|time_ago|', timeAgo).replace('|user|', user)
    },
    applicationBody () {
      // return this.githubIssue.body
      return this.submittedGeneralApplications[0].body
    },
    expandApplicationText () {
      return this.pageData.expand_application_text
    }
  },

  beforeDestroy () {
    this.setGithubIssue(false)
  },

  methods: {
    ...mapActions({
      setGithubIssue: 'general/setGithubIssue'
    }),
    accordionToggleStateChanged (toggleState) {
      if (toggleState.open === toggleState.total) {
        this.entireAccordionExpanded = true
      } else {
        this.entireAccordionExpanded = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$squigglySizing: 5.75rem;
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
.page-apply-success {
  position: relative;margin-top: -$siteHeaderHeight;
  padding-top: $siteHeaderHeight * 2;
  overflow: hidden;
  z-index: 25;
}

// /////////////////////////////////////////////////////// Submitted Application
#section-success {
  position: relative;
  z-index: 25;
  .submitted-applicaiton-top-border {
    top: -3px;
  }
}

.panel-left {
  padding-top: 9.375rem;
}

::v-deep .heading {
  margin-bottom: 2rem;
  @include mini {
    font-size: toRem(30);
  }
  @include tiny {
    font-size: toRem(24);
  }
}

.buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 2.75rem;
  .button-a {
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
}

.github-issue-link-button {
  :deep(svg) {
    width: 1rem;
    margin-right: 0.5rem;
    path {
      transition: 150ms ease-out;
      fill: $greenYellow;
    }
  }
  &:not([disabled]) {
    &:hover {
      :deep(svg) {
        path {
          transition: 150ms ease-in;
          fill: $aztec;
        }
      }
    }
  }
}

// /////////////////////////////////////////////////////////////////// Accordion
.accordion {
  margin-bottom: 11rem;
  position: relative;
}

.accordion-section {
  border: 3px solid $nandor;
  border-bottom: none;
  border-radius: toRem(10) toRem(10) toRem(7) toRem(7);
  padding: 1.25rem 1.25rem 1.25rem 3.875rem;
  &.open {
    .icon-chevron-down {
      transition: 150ms ease-out;
      transform: rotate(-180deg);
    }
  }
}

.accordion-header {
  cursor: pointer;
}

.header-title {
  letter-spacing: 0;
  margin-left: -2.5rem;
}

.icon-application-open {
  margin-right: 1.25rem;
}

.header-subtitle {
  :deep(.highlight) {
    color: $mandysPink;
    letter-spacing: 0;
  }
}

.icon-chevron-down {
  width: 1rem;
  margin-top: 1rem;
  transition: 150ms ease-in;
  margin-right: 1.5rem;
}

.markdown {
  padding: 3rem 5rem 0 0;
  @include small {
    padding-right: 3rem;
  }
  @include mini {
    padding-right: 0;
  }
}

// ////////////////////////////////////////////////////////////////// Warp Image
.panel-right {
  position: relative;
  top: -2.6875rem;
  height: 100%;
  @include small {
    top: -3.25rem;
  }
}

.warp-image-double {
  position: absolute;
  top: 0;
  left: 0;
  width: 18rem;
  height: 500rem;
  background-image: url('~assets/images/warp-image-double.png');
  background-position: top left;
  background-size: 40.5rem;
  @include tiny {
    width: calc(100% + 100vw * 0.041665 + 2rem);
  }
}
</style>
