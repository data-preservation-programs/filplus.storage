<template>
  <div :class="`page page-${tag} container`">

    <div id="section-success">

      <div class="grid">
        <div class="col-8_mi-10" data-push-left="off-1_mi-0" data-push-right="off-1_mi-0">
          <div class="panel-left">

            <h1 class="heading h3" v-html="pageHeading" />

            <!-- =================================================== Buttons -->
            <div class="buttons">

              <ButtonA
                v-if="githubIssueLink"
                class="github-issue-link-button"
                theme="green-outline"
                tag="a"
                target="_blank"
                :to="githubIssueLink">
                <GithubIcon />
                {{ githubIssueButtonText }}
              </ButtonA>

              <ButtonA
                to="/apply"
                tag="nuxt-link"
                class="new-application-button"
                theme="green">
                {{ newApplicationButtonText }}
              </ButtonA>

            </div>

            <!-- ================================================= Accordion -->
            <AppAccordion
              :entries="[githubIssue]"
              :expand-application-text="expandApplicationText"
              :view-on-github-text="viewOnGithubText"
              :application-subtitle="applicationSubtitle" />

          </div>
        </div>

        <!-- ==================================================== warp image -->
        <div class="col-2_mi-1">
          <div class="panel-right">
            <div class="warp-image-double" />
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================================== Overlays -->
    <Overlay type="noise" />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import GithubIcon from '@/components/icons/github'

import ButtonA from '@/components/buttons/button-a'
import AppAccordion from '@/components/app-accordion'
import Overlay from '@/components/overlay'

import ApplySucessPageData from '@/content/pages/apply-success.json'

// ====================================================================== Export
export default {
  name: 'ApplyPage',

  components: {
    GithubIcon,
    ButtonA,
    AppAccordion,
    Overlay
  },

  data () {
    return {
      tag: 'apply-success'
    }
  },

  async fetch ({ store, redirect }) {
    const application = await store.getters['account/githubIssue']
    if (!application) { return redirect('/apply') }
    await store.dispatch('general/getBaseData', { key: 'apply-success', data: ApplySucessPageData })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      githubIssue: 'account/githubIssue',
      account: 'auth/account'
    }),
    generalPageData () {
      return this.siteContent.general
    },
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    pageHeading () {
      return this.pageData.heading.replace('|data|', this.datacapRequested[1])
    },
    datacapRequested () {
      const applicationBody = this.githubIssue.body
      const generalDatacapRegEx = /(?:DataCap Requested: )(\d+\.?\d{0,2} \w{3})/
      const largeDatacapRegEx = /(?:### Total amount of DataCap being requested\n)(\d+\.?\d{0,2} \w{3})/
      const generalDatacap = applicationBody.match(generalDatacapRegEx)
      const largeDatacap = applicationBody.match(largeDatacapRegEx)
      return generalDatacap || largeDatacap
    },
    subheading () {
      return this.pageData.subheading
    },
    githubIssueLink () {
      return this.githubIssue.html_url
    },
    githubIssueButtonText () {
      return this.pageData.github_issue_button_text
    },
    newApplicationButtonText () {
      return this.pageData.new_application_button_text
    },
    applicationTitle () {
      return this.githubIssue.title
    },
    applicationSubtitle () {
      return this.pageData.application_subtitle
    },
    expandApplicationText () {
      return this.pageData.expand_application_text
    },
    viewOnGithubText () {
      return this.pageData.view_on_github_text
    }
  },

  beforeDestroy () {
    this.setGithubIssue(false)
  },

  methods: {
    ...mapActions({
      setGithubIssue: 'account/setGithubIssue'
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
  margin-bottom: toRem(143);
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
          fill: $lima;
        }
      }
    }
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
