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
              <CheckboxFullyStored
                :options="viewOnlyOpenData" />
              <Radio
                :options="viewApplicationType" />
              <Sort
                class="applications-sort-by"
                :options="sortOrderData" />
            </div>

            <AppAccordion
              :entries="applicationList"
              :expand-application-text="expandApplicationText"
              :view-on-github-text="viewOnGithubText"
              :application-subtitle="applicationSubtitle" />

            <PaginationControls
              :page="1"
              :total-pages="30" />
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
import { mapGetters } from 'vuex'

import AppAccordion from '@/components/app-accordion'
import ButtonA from '@/components/buttons/button-a'
import CheckboxFullyStored from '@/components/search/checkbox'
import Radio from '@/components/search/radio'
import Sort from '@/components/search/sort'
import PaginationControls from '@/components/search/pagination-controls'
import Overlay from '@/components/overlay'

import ApplicationsPageData from '@/content/pages/account-applications.json'

// ====================================================================== Export
export default {
  name: 'ApplicationsPage',

  components: {
    AppAccordion,
    ButtonA,
    CheckboxFullyStored,
    Radio,
    Sort,
    PaginationControls,
    Overlay
  },

  data () {
    return {
      tag: 'applications'
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
    pageHeading () {
      return this.pageData.heading.replace('|username|', 'tikagan')
    },
    newApplicationButtonText () {
      return this.pageData.new_application_button_text
    },
    applicationSubtitle () {
      return this.pageData.application_subtitle
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
    viewOnlyOpenData () {
      return [{
        label: 'View only open applications',
        value: 'true'
      }]
    },
    viewApplicationType () {
      return [
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
    sortOrderData () {
      return [
        {
          label: 'Newest first',
          value: 'newest_first'
        },
        {
          label: 'Open first ↓',
          value: 'open_first'
        }
      ]
    }
  },

  watch: {
    '$route' () {
      this.$nextTick(() => {
        // eslint-disable-next-line no-console
        console.log('$route ', this.$route)
        // this.insertFunctionName({ route: this.$route })
      })
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
  margin-bottom: 2rem;
  @include mini {
    font-size: toRem(30);
  }
  @include tiny {
    font-size: toRem(24);
  }
}

.applications-accordion {
  padding: 5rem 0;
}

.applications-accordion-toolbar {
  display: flex;
  .field-container {
    margin-right: 1rem;
  }
}

.applications-sort-by {
  display: flex;
  .field-select {
      height: unset !important;
  }
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
