<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroA
      :label="label"
      :heading="heading"
      heading-cols="col-8" />

    <!-- ========================================================== Notaries -->
    <div id="section-notaries">

      <Squigglie
        :percent-left="88"
        orientation="up"
        color="nandor"
        :thick="true"
        class="notaries-top-border" />

      <div class="grid-spaceBetween">

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

import NotariesPageData from '@/content/pages/notaries.json'
import NotariesListData from '@/content/data/notaries-list.json'

// ====================================================================== Export
export default {
  name: 'NotariesPage',

  components: {
    HeroA,
    NotariesTable,
    Overlay,
    Squigglie
  },

  data () {
    return {
      tag: 'notaries'
    }
  },

  async fetch ({ store }) {
    await store.dispatch('general/getBaseData', { key: 'notaries', data: NotariesPageData })
    await store.dispatch('general/getBaseData', { key: 'notaries-list', data: NotariesListData })
    const formId = 'filplus_application'
    const application = store.getters['general/application']
    const model = await store.dispatch('form/getFormModel', formId)
    if (!model) {
      await store.dispatch('form/registerFormModel', Object.assign(application, { formId }))
    }
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      application: 'general/application'
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

// ////////////////////////////////////////////////////////////////// Warp Image
.panel-left {
  position: relative;
  height: 100%;
}

.warp-image-double {
  position: absolute;
  top: 0;
  right: 0;
  width: 69rem;
  height: 500rem;
  background-image: url('~assets/images/warp-image-double.png');
  background-position: top right;
  background-size: 69rem;
}

// /////////////////////////////////////////////////////////////////////// Table
.table-heading-section,
.table-notaries-list {
  padding-left: 2.5rem;
}

.table-heading-section {
  padding-top: 5rem;
}

.table-label,
.table-heading {
  font-weight: 500;
}

.table-label {
  font-size: 1rem;
  margin-bottom: 2.5rem;
}

.table-heading {
  @include headingHighlight;
  margin-bottom: 4rem;
}
</style>
