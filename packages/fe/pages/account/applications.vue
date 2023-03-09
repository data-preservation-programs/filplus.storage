<template>
  <div :class="`page page-${tag} container`">

    <div id="section-applications">

      <div class="grid">
        <div class="col-8_mi-10" data-push-left="off-1_mi-0" data-push-right="off-1_mi-0">
          <div class="panel-left">

            <h1 class="heading h3" v-html="pageHeading" />
            <ButtonA
              to="/apply"
              tag="nuxt-link"
              class="new-application-button"
              theme="green">
              {{ newApplicationButtonText }}
            </ButtonA>

            <div class="applications-accordion-toolbar">
              <Checkbox
                :options="viewOnlyOpen" />
              <Radio
                class="filter-radio"
                :options="viewApplicationType" />
              <Sort
                class="sort-dropdown"
                :options="sortOrder" />
            </div>

            <AppAccordion
              :entries="applicationList"
              :expand-application-text="expandApplicationText"
              :view-on-github-text="viewOnGithubText"
              :application-subtitle="applicationSubtitle" />

            <div class="applications-accordion-toolbar">
              <PaginationControls
                :page="1"
                :total-pages="30" />

              <Limit
                :options="viewingPerPage" />
            </div>

          </div>

        </div>
        <!-- ======================================================== warp image -->
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
import { mapActions, mapGetters } from 'vuex'

import AppAccordion from '@/components/app-accordion'
import ButtonA from '@/components/buttons/button-a'
import Checkbox from '@/components/search/checkbox'
import Radio from '@/components/search/radio'
import Sort from '@/components/search/sort'
import PaginationControls from '@/components/search/pagination-controls'
import Limit from '@/components/search/limit'
import Overlay from '@/components/overlay'

import ApplicationsPageData from '@/content/pages/account-applications.json'

// ====================================================================== Export
export default {
  name: 'ApplicationsPage',

  components: {
    AppAccordion,
    ButtonA,
    Checkbox,
    Radio,
    Sort,
    PaginationControls,
    Limit,
    Overlay
  },

  data () {
    return {
      tag: 'applications'
    }
  },

  async fetch ({ app, store, route }) {
    await store.dispatch('general/getBaseData', { key: 'applications', data: ApplicationsPageData })
    await store.dispatch('general/getGeneralApplicationList', { route })
    await store.dispatch('general/getLargeApplicationList', { route })
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
    pageHeading () {
      return this.pageData.heading.replace('|username|', this.account.githubUsername)
    },
    newApplicationButtonText () {
      return this.pageData.new_application_button_text
    },
    applicationSubtitle () {
      return this.pageData.application_subtitle
    },
    applicationList () {
      const perPage = this.$route.query.perPage
      const applications = [...this.sortedApplicationList]
      return applications.slice(0, perPage)
    },
    expandApplicationText () {
      return this.pageData.expand_application_text
    },
    sortedApplicationList () {
      const allApplications = [...this.generalApplicationList, ...this.largeApplicationList]
      const sort = this.$route.query.sort
      switch (sort) {
        case 'newest_first':
          return this.sortApplications(allApplications, 1)
        default:
          return this.sortApplications(allApplications, 0)
      }
    },
    viewOnGithubText () {
      return this.pageData.view_on_github_text
    },
    viewOnlyOpen () {
      return [{
        label: 'View only open applications',
        value: 'true'
      }]
    },
    viewApplicationType () {
      return [
        {
          label: 'All',
          value: 'all'
        },
        {
          label: 'GA',
          value: 'GA'
        },
        {
          label: 'LDA',
          value: 'LDA'
        }
      ]
    },
    sortOrder () {
      return [
        {
          label: 'Open status',
          value: 'open_first'
        },
        {
          label: 'Newest to oldest',
          value: 'newest_first'
        }
      ]
    },
    viewingPerPage () {
      return [
        {
          label: 10,
          value: 10
        },
        {
          label: 20,
          value: 20
        },
        {
          label: 30,
          value: 30
        }
      ]
    }
  },

  watch: {
    '$route' () {
      this.$nextTick(() => {
        this.getGeneralApplicationList({ route: this.$route })
        this.getLargeApplicationList({ route: this.$route })
      })
    }
  },

  methods: {
    ...mapActions({
      getGeneralApplicationList: 'general/getGeneralApplicationList',
      getLargeApplicationList: 'general/getLargeApplicationList'
    }),
    sortApplications (applications, sort) {
      switch (sort) {
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
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-applications {
  position: relative;margin-top: -$siteHeaderHeight;
  padding-top: $siteHeaderHeight * 2;
  overflow: hidden;
  z-index: 25;
}

// //////////////////////////////////////////////////////////////// Applications
#section-applications {
  position: relative;
  padding-bottom: 4.125rem;
  border-top: 3px solid transparent;
  z-index: 25;
}

.panel-left {
  padding-top: 9.375rem;
}

::v-deep .heading {
  margin-bottom: 1rem;
  @include mini {
    font-size: toRem(30);
  }
  @include tiny {
    font-size: toRem(24);
  }
}

.new-application-button {
  margin-bottom: 4rem;
}

.applications-accordion-toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: toRem(19);
  .field-container {
    display: flex;
    align-items: center;
    // margin-right: toRem(20);
    :deep(.label), :deep(.field-label) {
      @include p2;
      font-weight: 500;
    }
  }
}

.filter-radio {
  :deep(.field-label) {
    margin-right: toRem(18);
  }
  :deep(.radio-wrapper) {
    .label {
      font-weight: 400;
    }
    &:not(:last-child) {
      margin-right: toRem(27);
    }
  }
}

.sort-dropdown {
  :deep(.field-label) {
    margin-right: toRem(18);
  }
  :deep(.field-select) {
    border: 2px solid $nandor;
    border-radius: toRem(10);
    padding: 0 toRem(15);
    width: toRem(195);
    height: unset;
  }
  :deep(.select) {
    border: none;
  }
  :deep(.selection-window) {
    padding: toRem(2) toRem(15);
    flex-direction: row-reverse;
    .icon-container {
      margin-right: toRem(20);
    }
  }
  :deep(.text) {
    @include p2;
    font-weight: 400;
  }
}

:deep(.accordion-wrapper) {
  width: 100%;
}

:deep(.applications-accordion) {
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
