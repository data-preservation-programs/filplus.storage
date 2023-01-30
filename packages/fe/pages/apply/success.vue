<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroA
      :heading="heading"
      heading-cols="col-12_mi-10_ti-12"
      content-cols="col-8_sm-10_mi-12">
    </HeroA>

    <!-- =========================================================== Success -->
    <div id="section-success">

      <Squigglie
        :percent-left="6"
        orientation="down"
        color="nandor"
        :thick="true"
        class="submitted-application-top-border" />

      <div class="grid">
        <div class="col-7_lg-8_sm-9_mi-10 success" data-push-left="off-1_mi-0">
          <h2 class="success-heading" v-html="subheading" />
          <MarkdownParser :markdown="submittedApplication.body" />
        </div>

        <div class="col-4_lg-3_sm-2_mi-1">
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
import { mapGetters } from 'vuex'

import HeroA from '@/components/hero-a'
import Overlay from '@/components/overlay'
import Squigglie from '@/components/squigglie'
import MarkdownParser from '@/components/markdown-parser'

import ApplySucessPageData from '@/content/pages/apply-success.json'

// ====================================================================== Export
export default {
  name: 'ApplyPage',

  components: {
    HeroA,
    Overlay,
    Squigglie,
    MarkdownParser
  },

  data () {
    return {
      tag: 'apply-success'
    }
  },

  async fetch ({ store }) {
    await store.dispatch('general/getBaseData', { key: 'apply-success', data: ApplySucessPageData })
    await store.dispatch('general/getSubmittedApplications')
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      submittedApplications: 'general/submittedApplications',
      githubIssueLink: 'general/githubIssueLink',
      account: 'account/account'
    }),
    generalPageData () {
      return this.siteContent.general
    },
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    heading () {
      return this.pageData.heading
    },
    subheading () {
      return this.pageData.subheading
    },
    githubIssueNumber () {
      // the regex I made is returning the '/' even though I put it in a non-capturing group?
      return this.githubIssueLink ? parseInt(this.githubIssueLink.slice(this.githubIssueLink.search(/(?:\/)(\d+)\b/) + 1)) : null
    },
    submittedApplication () {
      return this.isCurrentApplication(this.submittedApplications, this.githubIssueNumber)
    }
  },

  methods: {
    isCurrentApplication (allApplications, currentApplicationNumber) {
      return allApplications.find((application) => {
        if (application.number === currentApplicationNumber) {
          return application
        }
        return false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$squigglySizing: 5.75rem;

// ///////////////////////////////////////////////////////////////////// General
.page-apply-success {
  position: relative;
  overflow: hidden;
}

.submitted-application {
  height: 50rem
}

.overlay.type__noise {
  z-index: 5;
}

.container {
  position: relative;
}

// //////////////////////////////////////////////////////////////////////// Hero
::v-deep #hero {
  @include large {
    padding-bottom: toRem(144);
  }
  @include mini {
    padding-bottom: toRem(106);
  }
  .hero-content {
    padding-bottom: 0;
  }
  .bubble {
    margin-top: 1.5rem;
    white-space: nowrap;
    @include small {
      margin-top: 1rem;
    }
    @include mini {
      padding: 0.75rem 1.5rem;
    }
  }
}

// /////////////////////////////////////////////////////// Submitted Application
#section-success {
  position: relative;
  z-index: 25;
  .submitted-applicaiton-top-border {
    top: -3px;
  }
}

.success-heading {
  margin-top: 5rem;
}

.markdown {
  padding: 3rem 5rem 5rem 0;
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
  height: 100%;
}

.warp-image-double {
  position: absolute;
  top: 0;
  left: 0;
  width: 69rem;
  height: 500rem;
  background-image: url('~assets/images/warp-image-double.png');
  background-position: top left;
  background-size: 69rem;
}
</style>
