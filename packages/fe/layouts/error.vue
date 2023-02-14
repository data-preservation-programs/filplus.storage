<template>
  <div class="error-page">

    <HeroA
      :heading="message"
      background-image="block-backsplash.jpg"
      :hero-button="heroButton">
    </HeroA>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import HeroA from '@/components/hero-a'

// ====================================================================== Export
export default {
  name: 'ErrorPage',

  components: {
    HeroA
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    pageData () {
      return this.siteContent.general
    },
    heroButton () {
      return this.pageData['404_hero_button']
    },
    message () {
      return this.pageData['404_error_message']
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.inner-container {
  text-align: center;
}

::v-deep #hero {
  .overlay.type__opaque {
    background-color: rgba(15, 31, 26, 0.9);
  }
}
</style>
