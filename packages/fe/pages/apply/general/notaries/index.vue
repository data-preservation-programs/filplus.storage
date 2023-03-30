<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroA
      :label="label"
      :heading="heading"
      :hero-button="backButton"
      heading-cols="col-8_md-10_mi-10_ti-12" />

    <!-- ========================================================== Notaries -->
    <div id="section-notaries">

      <Squigglie
        :percent-left="88"
        orientation="up"
        color="nandor"
        :thick="true"
        class="notaries-top-border" />

      <div class="grid-spaceBetween-noBottom">

        <div class="col-1">
          <div class="panel-left">
            <div class="warp-image-double" />
          </div>
        </div>

        <div class="col-11 grid">
          <div class="col-10">
            <div class="table-heading-section">
              <div class="table-label">
                {{ tableLabel }}
              </div>
              <div class="table-heading">
                {{ tableHeading }}
              </div>
            </div>
          </div>
          <div class="col-12">
            <NotariesTable />
          </div>
          <div class="grid-right">
            <ButtonX
              :to="backButton.href"
              :tag="backButton.type"
              :theme="backButton.theme">
              <Chevron />
              <div class="text" v-html="backButton.label" />
            </ButtonX>
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
import NotariesTable from '@/components/notaries-table'
import Squigglie from '@/components/squigglie'
import ButtonX from '@/components/buttons/button-x'
import Chevron from '@/components/icons/chevron'

import NotariesPageData from '@/content/pages/notaries.json'

// ====================================================================== Export
export default {
  name: 'NotariesPage',

  components: {
    HeroA,
    NotariesTable,
    Overlay,
    Squigglie,
    ButtonX,
    Chevron
  },

  data () {
    return {
      tag: 'notaries'
    }
  },

  async fetch ({ app, store }) {
    await store.dispatch('general/getBaseData', { key: 'notaries', data: NotariesPageData })
    await store.dispatch('general/getCachedFile', 'notaries-list.json')
    const application = await store.dispatch('account/setHubspotOptInData', store.getters['auth/account'])
    await app.$form('filplus_application').register(application)
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    label () {
      return this.pageData.label
    },
    heading () {
      return this.pageData.heading
    },
    backButton () {
      return this.pageData.back_button
    },
    table () {
      return this.pageData.table
    },
    tableLabel () {
      return this.pageData.table.label
    },
    tableHeading () {
      return this.pageData.table.heading
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-notaries {
  position: relative;
  overflow: hidden;
}

:deep(.hero-content) {
  .label {
    @include mini {
      font-size: toRem(14);
      margin-left: 2rem;
    }
  }
  .heading {
    white-space: nowrap;
    letter-spacing: 0;
    .bubble {
      margin-bottom: 1.25rem;
    }
    @include mini {
      .bubble {
        padding: 0.75rem 1.5rem;
        margin-bottom: 0.75rem;
      }
    }
  }
}

#section-notaries {
  position: relative;
  border-top: 2px solid transparent;
  z-index: 25;
}

.notaries-top-border {
  top: -3px;
  :deep(path) {
    fill: $aztec;
  }
}

.overlay.type__noise {
  z-index: 5;
}

.button {
  display: inline-block;
  margin-bottom: 2rem;
}

// ////////////////////////////////////////////////////////////////// Warp Image
.panel-left {
  position: relative;
  height: calc(100% + 1.125rem);
}

.warp-image-double {
  position: absolute;
  top: 0;
  right: 0;
  width: 69rem;
  height: calc(100% + 3px);
  background-image: url('~assets/images/warp-image-double.png');
  background-position: top right;
  background-size: 69rem;
}

// /////////////////////////////////////////////////////////////////////// Table
.table-heading-section,
.table-notaries-list {
  padding-left: 2.5rem;
  @include mini {
    padding-left: 0.5rem;
  }
}

.table-heading-section {
  padding-top: 5rem;
  @include mini {
    padding-top: 2rem;
  }
}

.table-label,
.table-heading {
  font-weight: 500;
}

.table-label {
  font-size: 1rem;
  margin-bottom: 2.5rem;
  @include small {
    font-size: 0.875rem;
    margin-bottom: 0.625rem;
  }
}

.table-heading {
  @include headingHighlight;
  margin-bottom: 4rem;
  @include small {
    font-size: 1.25rem;
    margin-bottom: 1.125rem;
  }
}
</style>
