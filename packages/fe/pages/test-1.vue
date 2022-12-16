<template>
  <div :class="`page page-${tag} container`">

    Test 1

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Test1Data from '@/content/pages/test-1.json'

// ====================================================================== Export
export default {
  name: 'Test1Page',

  data () {
    return {
      tag: 'test-1'
    }
  },

  async fetch ({ store }) {
    await store.dispatch('general/getBaseData', { key: 'test-1', data: Test1Data })
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
    form () {
      return this.pageData.form
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-test-1 {
  position: relative;
  overflow: hidden;
}
</style>
