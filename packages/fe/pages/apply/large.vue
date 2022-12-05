<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroB
      :label="hero.label"
      :heading="hero.heading"
      :subtext="hero.subtext" />

    <!-- ======================================================= Application -->
    <div id="application">
      <div class="grid-center">
        <div class="col-10">

          FORM

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

import HeroB from '@/components/hero-b'
import Overlay from '@/components/overlay'

import ApplyLargePageData from '@/content/pages/apply-large.json'

// ====================================================================== Export
export default {
  name: 'ApplyLargePage',

  components: {
    HeroB,
    Overlay
  },

  data () {
    return {
      tag: 'apply-large'
    }
  },

  async fetch ({ store }) {
    await store.dispatch('general/getBaseData', { key: 'apply-large', data: ApplyLargePageData })
    const application = store.getters['general/application']
    if (!application) {
      await store.dispatch('form/registerFormModel', Object.assign(application, {
        formId: 'datacap_size_selection',
        state: 'valid'
      }))
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
      return this.siteContent['apply-large'].page_content
    },
    hero () {
      return this.pageData.hero
    }
    // label () {
    //   return this.pageData.label
    // }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-large {
  overflow: hidden;
}
</style>
