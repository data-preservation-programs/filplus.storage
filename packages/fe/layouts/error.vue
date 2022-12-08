<template>
  <div class="error-page">

    <HeroA
      :heading="message"
      background-image="block-backsplash.jpg">
      <div class="inner-container">

        <ButtonX
          :to="homeButtonUrl"
          tag="nuxt-link">
          {{ homeButtonText }}
        </ButtonX>

      </div>
    </HeroA>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import HeroA from '@/components/hero-a'
import ButtonX from '@/components/buttons/button-x'

// ====================================================================== Export
export default {
  name: 'ErrorPage',

  components: {
    HeroA,
    ButtonX
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    pageData () {
      return this.siteContent.general
    },
    homeButtonUrl () {
      return this.pageData.navigation.home_link
    },
    homeButtonText () {
      return this.pageData['404_home_button_text']
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

.button {
  display: inline-block;
}
</style>
