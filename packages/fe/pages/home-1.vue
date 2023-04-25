<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroC
      :heading="heading"
      heading-cols="col-12"
      content-direction="horizontal"
      background-image="block-backsplash.jpg" />

    <!-- =============================================================== FAQ -->
    <div id="section-content">

      <Squigglie
        :percent-left="6"
        orientation="down"
        color="nandor"
        :thick="true"
        class="section-top-border" />

      <div class="grid-spaceBetween">

        <div class="col-7_lg-8_sm-9_mi-10" data-push-left="off-1_mi-0">

          <MarkdownParser :markdown="markdown" />

        </div>

        <div class="col-4_lg-3_sm-2_mi-1">
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

import HeroC from '@/components/hero-c'
import MarkdownParser from '@/components/markdown-parser'
import Overlay from '@/components/overlay'
import Squigglie from '@/components/squigglie'

import Home1PageData from '@/content/pages/home-1.json'
import AboutContent from '@/content/markdown/about.md'

// ====================================================================== Export
export default {
  name: 'Home1',

  components: {
    HeroC,
    MarkdownParser,
    Overlay,
    Squigglie
  },

  data () {
    return {
      tag: 'home-1'
    }
  },

  async fetch ({ app, store }) {
    await store.dispatch('general/getBaseData', { key: 'home-1', data: Home1PageData })
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
    heading () {
      return this.pageData.heading
    },
    markdown () {
      return AboutContent
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-home-1 {
  position: relative;
  overflow: hidden;
}

.overlay.type__noise {
  z-index: 5;
}

// //////////////////////////////////////////////////////////////////////// Hero
::v-deep #hero {
  .heading {
    @include medium {
      flex-direction: column;
    }
  }
  .overlay.type__opaque {
    background-color: rgba(15, 31, 26, 0.9);
  }
}

:deep(.hero-content) {
  @include mini {
    padding-bottom: 7rem;
  }
}

// //////////////////////////////////////////////////////////////////////// Body
#section-content {
  position: relative;
  padding-bottom: 7.3125rem;
  border-top: 3px solid transparent;
  z-index: 10;
}

.section-top-border {
  top: -3px;
}

.markdown {
  padding: 5rem 0 3rem;
  padding-right: 5rem;
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
  height: 100%;
}

.warp-image-double {
  position: absolute;
  top: 0;
  left: 0;
  width: 69rem;
  height: 500rem;
  background-image: url('~assets/images/warp-image-double.png');
  background-position: top left;
  background-size: 69rem;
}
</style>
