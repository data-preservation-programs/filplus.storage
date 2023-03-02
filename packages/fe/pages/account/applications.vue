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

          <ApplicationsAccordion
            :entries="applicationList"
            :toggle-button-content="accordionToggleButtonText" />

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
import ApplicationsAccordion from '@/components/applications-accordion'
import Overlay from '@/components/overlay'
import Squigglie from '@/components/squigglie'

import ApplicationsPageData from '@/content/pages/account-applications.json'

// ====================================================================== Export
export default {
  name: 'ApplicationsPage',

  components: {
    HeroA,
    ApplicationsAccordion,
    Overlay,
    Squigglie
  },

  data () {
    return {
      tag: 'applications'
    }
  },

  async fetch ({ app, store }) {
    await store.dispatch('general/getBaseData', { key: 'applications', data: ApplicationsPageData })
    await store.dispatch('general/getGeneralApplicationList')
    await store.dispatch('general/getLargeApplicationList')
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      generalApplicationList: 'general/generalApplicationList',
      largeApplicationList: 'general/largeApplicationList'
    }),
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    heading () {
      return this.pageData.heading
    },
    accordionToggleButtonText () {
      return this.pageData.accordion_button_toggle_text
    },
    ctaCard () {
      return this.pageData.cta_card
    },
    applicationList () {
      return [...this.generalApplicationList, ...this.largeApplicationList]
    }
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
