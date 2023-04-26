<template>
  <div :class="`page page-${tag} container`">

    <!-- =========================================================== Roadmap -->
    <Roadmap />

    <!-- ========================================================== Overlays -->
    <Overlay type="noise" />

  </div>
</template>

<script>
// ===================================================================== Imports
import Roadmap from '@/components/page-index/roadmap'
import Overlay from '@/components/overlay'

import IndexPageData from '@/content/pages/index.json'

// ====================================================================== Export
export default {
  name: 'IndexPage',

  components: {
    Roadmap,
    Overlay
  },

  data () {
    return {
      tag: 'index'
    }
  },

  async fetch ({ app, store }) {
    await store.dispatch('general/getBaseData', { key: 'index', data: IndexPageData })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-index {
  padding-top: $siteHeaderHeight;
}

section {
  position: relative;
  z-index: 10;
}

.overlay.type__noise {
  z-index: 5;
}
</style>
