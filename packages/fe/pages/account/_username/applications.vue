<template>
  <div :class="`page page-${tag} container`">

    <div id="section-applications">

      <div class="grid">

        <!-- ======================================================= Content -->
        <div class="col-8_mi-10" data-push-left="off-1_mi-0" data-push-right="off-1_mi-0">
          <div class="panel-left">

            <h1 class="heading h3" v-html="pageHeading" />

            <ButtonA
              to="/apply"
              tag="nuxt-link"
              class="new-application-button"
              theme="green">
              {{ pageData.new_application_button_text }}
            </ButtonA>

            <div :class="['toolbar top', { loading: refresh }]">
              <Spinner />
              <div class="content">
                <Checkbox
                  class="filter-checkbox"
                  :options="filters.state"
                  @filterApplied="filterApplied" />
                <Radio
                  class="filter-radio"
                  :options="filters.view_application_type" />
                <Sort
                  class="filter-sort"
                  :options="filters.sort" />
              </div>
            </div>

            <div v-if="noResults && !loading" class="no-results">
              {{ pageData.no_results_text }}
            </div>

            <AppAccordion
              v-if="applicationList"
              :entries="applicationList"
              :expand-application-text="pageData.expand_application_text"
              :view-on-github-text="pageData.view_on_github_text"
              :application-subtitle="pageData.application_subtitle" />

            <div
              v-if="loading && (!applicationList || noResults)"
              class="loading-container">
              <span>{{ pageData.loading_text }}</span>
              <LoaderTripleDot />
            </div>

            <div :class="['toolbar bottom', { loading: refresh, 'single-page-results': totalPages === 1 }]">
              <Spinner />
              <div class="content">
                <PaginationControls
                  v-if="totalPages > 1"
                  :page="page"
                  :total-pages="totalPages"
                  :loading="refresh" />
                <Limit
                  class="limit"
                  :options="filters.limit" />
              </div>
            </div>

          </div>

        </div>

        <!-- ==================================================== Warp image -->
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
import Spinner from '@/components/spinners/material-circle'
import LoaderTripleDot from '@/components/spinners/triple-dot'

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
    Overlay,
    LoaderTripleDot,
    Spinner
  },

  data () {
    return {
      tag: 'applications'
    }
  },

  async fetch ({ app, store, redirect, route }) {
    const accountExists = await store.getters['auth/account']
    if (!accountExists) { return redirect('/apply') }
    await store.dispatch('general/getBaseData', { key: 'applications', data: ApplicationsPageData })
    await store.dispatch('account/setLoadingStatus', { type: 'loading', status: true })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      applicationList: 'account/applicationList',
      loading: 'account/loading',
      refresh: 'account/refresh',
      metadata: 'account/metadata',
      account: 'auth/account',
      view: 'account/view'
    }),
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    filters () {
      return this.pageData.filters
    },
    pageHeading () {
      return this.pageData.heading.replace('|username|', this.account.githubUsername)
    },
    page () {
      return this.metadata.page
    },
    totalPages () {
      return this.metadata.totalPages
    },
    noResults () {
      return !this.applicationList
    }
  },

  async mounted () {
    const query = this.$route.query
    await this.setView(query.view || this.view)
    await this.fetchData()
    if (!this.applicationList) {
      await this.setView('ga')
      this.$router.replace({
        path: this.$route.path,
        query: {
          ...query,
          state: 'open',
          view: 'ga'
        }
      }).catch(() => {})
    }
    this.$nuxt.$on('filtersApplied', (payload) => {
      const filters = payload.filters
      const viewFilter = filters.find(filter => filter.id === 'view')
      if (!this.refresh) {
        this.filterApplied(viewFilter)
      }
    })
  },

  methods: {
    ...mapActions({
      getApplicationList: 'account/getApplicationList',
      setLoadingStatus: 'account/setLoadingStatus',
      setView: 'account/setView'
    }),
    async fetchData () {
      await this.getApplicationList(this.view)
      this.setLoadingStatus({ type: 'loading', status: false })
      this.setLoadingStatus({ type: 'refresh', status: false })
    },
    async filterApplied (filter) {
      if (!this.refresh) {
        await this.setLoadingStatus({ type: 'refresh', status: true })
        if (filter && filter.id === 'view') { await this.setView(filter.value) }
        await this.fetchData()
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
  overflow: clip;
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

.toolbar {
  position: relative;
  display: flex;
  margin-bottom: 1rem;
  &.loading {
    .spinner {
      display: flex;
    }
    .content {
      transition: 100ms ease-in;
      opacity: 0.2;
      pointer-events: none;
    }
  }
  &.single-page-results {
    .content {
      justify-content: flex-end;
    }
  }
  .content {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    transition: 100ms ease-out;
  }
  .spinner {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
}

:deep(.field-container) {
  display: flex;
  align-items: center;
  &.focused {
    .field-label {
      color: $aquaSqueeze;
      transform: scale(1);
    }
  }
  .label,
  .field-label {
    @include p2;
  }
  .select-container .select {
    border: none;
    .text {
      @include p2;
      font-weight: 400;
    }
  }
}

.filter-checkbox,
.filter-radio {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.filter-checkbox {
  :deep(.label) {
    font-weight: 500;
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
    .radio {
      &:checked {
        + .checker {
          border-color: $nandor;
        }
      }
    }
  }
}

.filter-sort,
.limit {
  :deep(.field-select) {
    border: 2px solid $nandor;
    border-radius: toRem(10);
    padding: 0 toRem(15);
    width: toRem(195);
    height: unset;
    .icon-chevron {
      color: $nandor;
    }
  }
}

.filter-sort {
  :deep(.field-label) {
    margin-right: toRem(18);
  }
  :deep(.selection-window) {
    padding: toRem(2) toRem(15);
    flex-direction: row-reverse;
    .icon-container {
      margin-right: toRem(20);
    }
  }
}

.limit {
  :deep(.field-label) {
    margin-right: toRem(20);
    font-weight: 400;
  }
  :deep(.field-select) {
    width: toRem(65);
  }
  :deep(.selection-window) {
    padding: toRem(10);
    .text {
      padding-right: toRem(9);
      color: $greenYellow;
    }
  }
  :deep(.dropdown) {
    top: unset;
    bottom: 100%;
    .option.selected {
      color: $greenYellow;
    }
  }
}

.loading-container,
.no-results {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1rem;
  border: 3px solid $nandor;
  padding: 1.25rem 1.75rem;
  border-radius: 0.625rem;
}

:deep(.triple-dot-loader) {
  margin-left: 0.5rem;
  .dot {
    width: 0.5rem;
    height: 0.5rem;
    background-color: $greenYellow;
  }
}

#pagination-controls {
  color: $greenYellow;
}

.spinner {
  margin-left: 1rem;
  :deep(circle) {
    stroke: $greenYellow;
  }
}

:deep(.accordion-wrapper) {
  width: 100%;
}

:deep(.applications-accordion) {
  margin-bottom: 2rem;
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
