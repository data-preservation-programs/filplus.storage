<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroA
      :heading="heading"
      heading-cols="col-12"
      content-direction="horizontal"
      background-image="block-backsplash.jpg" />

    <!-- =============================================================== FAQ -->
    <div id="section-content">
      <div class="grid-spaceBetween">

        <div class="col-7" data-push-left="off-1">

          <MarkdownParser :markdown="markdown" />

          <Card
            icon="arrow"
            :outline="true"
            class="apply-cta-card">
            <template v-if="ctaCard">

              <div class="title">
                {{ ctaCard.title }}
              </div>

              <div
                class="description"
                v-html="ctaCard.description">
              </div>

            </template>
          </Card>

        </div>

        <div class="col-3">
          <div class="panel-right">
            <div class="warp-image-double" />
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================================== Overlays -->
    <Overlay type="noise" />

    <BackgroundGradients />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import HeroA from '@/components/hero-a'
import MarkdownParser from '@/components/markdown-parser'
import Overlay from '@/components/overlay'
import Card from '@/components/card'
import BackgroundGradients from '@/components/background-gradients'

import AboutPageData from '@/content/pages/about.json'
import AboutContent from '@/content/markdown/about.md'

// ====================================================================== Export
export default {
  name: 'AboutPage',

  components: {
    HeroA,
    MarkdownParser,
    Overlay,
    Card,
    BackgroundGradients
  },

  data () {
    return {
      tag: 'about'
    }
  },

  async fetch ({ store }) {
    await store.dispatch('general/getBaseData', { key: 'about', data: AboutPageData })
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
    ctaCard () {
      return this.pageData.cta_card
    },
    markdown () {
      return AboutContent
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-about {
  overflow: hidden;
}

.overlay.type__noise {
  z-index: 5;
}

// //////////////////////////////////////////////////////////////////////// Hero
::v-deep #hero {
  .bubble {
    margin-left: 1.25rem;
  }
  .overlay.type__opaque {
    background-color: rgba(15, 31, 26, 0.9);
  }
}

// //////////////////////////////////////////////////////////////////////// Body
#section-content {
  position: relative;
  padding-bottom: 7.3125rem;
  border-top: 3px solid $nandor;
  z-index: 10;
}

.markdown {
  padding: 5rem 0;
}

.apply-cta-card {
  width: 57%;
  @include medium {
    width: 100%;
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
    padding: toRem(37) 2rem 1.875rem toRem(43);
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
