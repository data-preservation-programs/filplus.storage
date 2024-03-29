<template>
  <div :class="`page page-${tag}`">

    <!-- ============================================================== Hero -->
    <HeroA
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

          <Infographic />

          <div
            v-if="ctaCard"
            class="cta-card-wrapper"
            @click="$highlightApplyForm">
            <Card
              icon="arrow"
              :outline="true"
              class="apply-cta-card">
              <div class="title">
                {{ ctaCard.title }}
              </div>

              <div
                class="description"
                v-html="ctaCard.description">
              </div>
            </Card>
          </div>
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

import HeroA from '@/components/hero-a'
import MarkdownParser from '@/components/markdown-parser'
import Overlay from '@/components/overlay'
import Squigglie from '@/components/squigglie'
import Card from '@/components/card'
import Infographic from '@/components/infographic'

import AboutPageData from '@/content/pages/about.json'
import AboutContent from '@/content/markdown/about.md'

// ====================================================================== Export
export default {
  name: 'AboutPage',

  components: {
    HeroA,
    MarkdownParser,
    Overlay,
    Squigglie,
    Card,
    Infographic
  },

  data () {
    return {
      tag: 'about'
    }
  },

  async fetch ({ app, store }) {
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
  .heading {
    @include medium {
      flex-direction: column;
    }
  }
  .bubble {
    margin-left: 1.25rem;
    @include medium {
      margin-left: 0;
      margin-top: 1.25rem;
    }
    @include mini {
      margin-top: 0.75rem;
      padding: 0.75rem 1.5rem;
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
  z-index: 10;
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

.infographic-container {
  margin: 0 5rem 3rem 0;
  :deep(.infographic-wrapper) {
    height: clamp(toRem(345), vw(500px), toRem(500));
    &.with-fil-plus {
      height: clamp(toRem(390), vw(600px), toRem(594));
    }
    .title {
      font-size: toRem(23);
    }
  }

  :deep(.infographic-toggle) {
    width: toRem(70);
    height: toRem(35);
  }
  :deep(.toggle-switch) {
    width: toRem(23);
    height: toRem(23);
    transform: translateX(toRem(35));
  }

  @include small {
    margin-right: 3rem;
    :deep(.infographic-wrapper) {
      height: auto;
      &.with-fil-plus {
        height: auto;
      }
    }
  }
  @include mini {
    :deep(.infographic-wrapper) {
      .title {
        font-size: clamp(toRem(14), 16px + 1vw , toRem(17));
      }
      .infographic-toggle {
        width: toRem(60);
        height: toRem(30);
      }
      .toggle-switch {
        width: toRem(20);
        height: toRem(20);
        margin: 0 toRem(2);
        transform: translateX(toRem(30));
      }
    }
  }
  @include tiny {
    margin-right: 0;
    :deep(.infographic-wrapper) {
      .title {
        font-size: toRem(14);
      }
    }
  }
}
// ////////////////////////////////////////////////////////////////// Warp Image
.panel-right {
  position: relative;
  height: 100%;
}

.warp-image-double {
  position: absolute;
  top: 3px;
  left: 0;
  width: 69rem;
  height: 500rem;
  background-image: url('~assets/images/warp-image-double.png');
  background-position: top left;
  background-size: 69rem;
}
</style>
