<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroA
      :heading="heading"
      heading-cols="col-12" />

    <!-- =============================================================== FAQ -->
    <div id="section-applications">

      <Squigglie
        :percent-left="6"
        orientation="down"
        color="nandor"
        :thick="true"
        class="applications-top-border" />

      <div class="grid-spaceBetween">

        <div class="col-12">

          <AppAccordion
            :entries="applicationList"
            :expand-application-text="expandApplicationText"
            :view-on-github-text="viewOnGithubText"
            :application-subtitle="applicationSubtitle" />

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
import AppAccordion from '@/components/app-accordion'
import Overlay from '@/components/overlay'
import Squigglie from '@/components/squigglie'

import ApplicationsPageData from '@/content/pages/account-applications.json'

// ====================================================================== Export
export default {
  name: 'ApplicationsPage',

  components: {
    HeroA,
    AppAccordion,
    Overlay,
    Squigglie
  },

  data () {
    return {
      tag: 'applications',
      entireAccordionExpanded: false,
      applicationsPerPage: 10,
      sortSelectValue: 0,
      currentPage: 1,
      loading: false
    }
  },

  async fetch ({ app, store }) {
    await store.dispatch('general/getBaseData', { key: 'applications', data: ApplicationsPageData })
    await store.dispatch('general/getGeneralApplicationList', this.applicationsPerPage)
    await store.dispatch('general/getLargeApplicationList', this.applicationsPerPage)
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      generalApplicationList: 'general/generalApplicationList',
      largeApplicationList: 'general/largeApplicationList',
      account: 'account/account'
    }),
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    heading () {
      return this.pageData.heading
    },
    applicationList () {
      return [...this.generalApplicationList, ...this.largeApplicationList]
    },
    expandApplicationText () {
      return this.pageData.expand_application_text
    },
    viewOnGithubText () {
      return this.pageData.view_on_github_text
    },
    applicationSubtitle () {
      return this.pageData.application_subtitle
    },
    sortedApplications () {
    // eslint-disable-next-line no-console
    // console.log('sortedApplications ', Array.isArray(this.allSubmittedApplications))
      const applications = Array.isArray(this.applicationList) ? [...this.applicationList] : null
      // eslint-disable-next-line no-console
      // console.log('sortedApplications applications ', applications)
      if (Array.isArray(applications)) {
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
      }
      return applications
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
    // eslint-disable-next-line no-console
    console.log('applications.vue mounted ', this.applicationsPerPage)
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-applications {
  position: relative;
  overflow: hidden;
}

.overlay.type__noise {
  z-index: 5;
}

// //////////////////////////////////////////////////////////////////////// Hero
:deep(.hero-content) {
  @include mini {
    padding-bottom: 7rem;
  }
  .bubble {
    margin-top: 2.75rem;
    @include small {
      margin-top: 1.5rem;
    }
    @include mini {
      padding: 0.75rem 1.5rem;
      margin-top: 1rem;
      white-space: nowrap;
    }
  }
}

// ///////////////////////////////////////////////////////////////////////// FAQ
#section-applications {
  position: relative;
  padding-bottom: 4.125rem;
  border-top: 3px solid transparent;
  z-index: 25;
}

.applications-top-border {
  top: -3px;
}

.applications-accordion {
  padding: 5rem 0;
}

:deep(.accordion-wrapper) {
  width: 100%;
}

:deep(.applications-accordion) {
  padding-right: 5rem;
  @include small {
    padding-right: 3rem;
  }
  @include mini {
    padding-right: 0;
  }
}

.cta-card-wrapper {
  cursor: pointer;
}

.apply-cta-card.corner-position__top-right {
  display: inline-block;
  width: 26.6875rem;
  @include medium {
    width: calc(100% - 5rem);
  }
  @include small {
    width: calc(100% - 3rem);
  }
  @include mini {
    width: 100%;
  }
  &:hover {
    :deep(.icon.arrow) {
      transform: rotate(45deg);
    }
  }
  .title {
    font-size: toRem(30);
    line-height: leading(40, 30);
    font-weight: 500;
    margin-bottom: 1.5rem;
    margin-right: 5rem;
  }
  .description {
    margin-bottom: toRem(27);
  }
  :deep(.content) {
    padding: toRem(37) 2rem 1.875rem toRem(43) !important;
  }
}
</style>
