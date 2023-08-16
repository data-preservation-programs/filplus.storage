<template>
  <div :class="`page page-${tag}`">

    <!-- ============================================================== Hero -->
    <HeroC :heading="heading" />

    <!-- ================================================== Section Overview -->
    <section id="section-overview" class="section">

      <Squigglie
        :percent-left="6"
        orientation="down"
        color="nandor"
        :thick="true" />

      <div class="grid">
        <div
          class="col-10_ti-12"
          data-push-left="off-1_ti-0">
          <div class="inner-wrapper">
            <div class="heading">
              {{ overview.heading }}
            </div>
            <div class="subheading">
              {{ overview.subheading }}
            </div>
          </div>
        </div>
      </div>

    </section>

    <!-- ================================================== Program Graphics -->
    <section id="section-graphics" class="section">

      <Squigglie
        :percent-left="90"
        orientation="up"
        color="nandor"
        :thick="true" />

      <div class="grid">
        <div
          v-for="(card, i) in graphics"
          :key="`graphic-card-${i}`"
          :class="`col-4_sm-12 graphic-card-${i}`"
          data-push-left="off-0_sm-0">
          <div class="graphic-card">

            <div class="graphic-wrapper">
              <img :src="card.image" />
            </div>

            <div class="text-content">
              <div class="title">
                {{ card.title }}
              </div>
              <div class="description">
                {{ card.description }}
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>

    <!-- ====================================================== Program Info -->
    <section id="section-program-info" class="section">

      <Squigglie
        :percent-left="90"
        orientation="down"
        color="nandor"
        :thick="true" />

      <div class="grid-noGutter">

        <div class="col-4_lg-3">
          <div class="panel-left">
            <img :src="programImage" class="textural-image" />
          </div>
        </div>

        <div class="col-7_lg-9" data-push-left="off-0">
          <div class="inner-wrapper">
            <h3 class="heading bubble right">
              {{ programHeading }}
            </h3>
            <div class="program">
              <div
                v-for="(entry, i) in program"
                :key="`program-entry-${i}`"
                class="program-info-entry">

                <Squigglie
                  v-if="i === 1 || i === 3"
                  :percent-left="i === 1 ? 90 : 10"
                  :orientation="i === 1 ? 'up' : 'down'"
                  color="nandor"
                  :thick="true" />

                <div
                  class="entry"
                  v-html="entry">
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

    </section>

    <!-- =========================================================== Roadmap -->
    <Roadmap />

    <!-- ========================================== Section Subfooter Slider -->
    <section id="section-subfooter-slider" class="section">

      <Squigglie
        :percent-left="90"
        orientation="down"
        color="nandor"
        :thick="true" />

      <div class="grid-noGutter">

        <div class="col-3_sm-hidden">
          <div class="panel-left">
            <div class="warp-image-double" />
          </div>
        </div>

        <div
          class="col-8_sm-12"
          data-push-left="off-1_sm-0">
          <div class="card-container">
            <div
              class="form-cta-heading"
              v-html="subfooterCtaHeading">
            </div>
            <ApplyFormCard id="apply-form-card" />
          </div>
        </div>

      </div>

    </section>

    <!-- ========================================================== Overlays -->
    <Overlay type="noise" />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import HeroC from '@/components/hero-c'
import Roadmap from '@/components/page-index/roadmap'
import ApplyFormCard from '@/components/apply-form-card'
import Squigglie from '@/components/squigglie'
import Overlay from '@/components/overlay'

import IndexPageData from '@/content/pages/index.json'
import ApplyPageData from '@/content/pages/apply.json'

// ====================================================================== Export
export default {
  name: 'IndexPage',

  components: {
    HeroC,
    Roadmap,
    ApplyFormCard,
    Squigglie,
    Overlay
  },

  data () {
    return {
      tag: 'index'
    }
  },

  async fetch ({ app, store }) {
    await store.dispatch('general/getBaseData', { key: 'index', data: IndexPageData })
    await store.dispatch('general/getBaseData', { key: 'apply', data: ApplyPageData })
    await store.dispatch('account/getApplicationSchema')
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
    heading () {
      return this.pageData.heading
    },
    overview () {
      return this.pageData.section_overview
    },
    graphics () {
      return this.pageData.section_graphics.cards
    },
    programHeading () {
      return this.pageData.section_program.heading
    },
    programImage () {
      return this.pageData.section_program.image
    },
    program () {
      return this.pageData.section_program.entries
    },
    subfooterCtaHeading () {
      return this.pageData.section_subfooter_slider.heading
    }
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

// //////////////////////////////////////////////////////////// Section Overview
#section-overview {
  padding: 4rem 0;
  .inner-wrapper {
    padding: 0 5rem;
    @include medium {
      padding: 0;
    }
  }
  .heading,
  .subheading {
    text-align: center;
  }
  .heading {
    font-size: toRem(55);
    font-weight: 500;
    line-height: leading(50, 55);
    margin-bottom: 2rem;
    @include mini {
      font-size: toRem(30);
      line-height: leading(45, 30);
      margin-bottom: 0.5rem;
    }
  }
  .subheading {
    font-size: toRem(30);
    font-weight: 400;
    line-height: leading(50, 30);
    letter-spacing: 0.02em;
    @include mini {
      font-size: 1rem;
      line-height: leading(30, 16);
    }
  }
}

// //////////////////////////////////////////////////////////// Section Graphics
.graphic-card-0 {
  img {
    width: toRem(145);
  }
}

.graphic-card-1 {
  position: relative;
  border-left: solid 3px $nandor;
  border-right: solid 3px $nandor;
  @include small {
    border: 0;
    &:before,
    &:after {
      content: '';
      position: absolute;
      left: calc(-4.1665% - 3px);
      width: calc(100% + 4.1665% * 2 + 6px);
      height: 3px;
      background-color: $nandor;
    }
    &:before {
      top: 0;
    }
    &:after {
      bottom: 0;
    }
  }
  img {
    width: toRem(215);
    @include medium {
      width: toRem(160);
    }
  }
}

.graphic-card-2 {
  img {
    width: toRem(145);
  }
}

.graphic-card,
.graphic-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.graphic-card {
  height: 100%;
  padding: toRem(90) toRem(35) toRem(55) toRem(35);
}

.graphic-wrapper {
  flex: 1;
  justify-content: center;
  margin-bottom: toRem(90);
  @include small {
    margin-bottom: toRem(40);
  }
}

.text-content {
  .title,
  .description {
    text-align: center;
  }
  .title {
    @include h3;
    margin-bottom: toRem(32);
  }
  .description {
    font-size: toRem(21);
    line-height: leading(30, 21);
    letter-spacing: 0.02em;
  }
  @include medium {
    .title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    .description {
      font-size: 1rem;
    }
  }
}

// //////////////////////////////////////////////////////// Section Program Info
#section-program-info {
  [class~="col"], [class*="col-"], [class*="col_"] {
    &:first-child {
      z-index: 10;
    }
  }
  .inner-wrapper {
    padding-top: toRem(82);
    padding-bottom: 3rem;
    border-left: solid 3px $nandor;
    @include small {
      padding-top: 3.5rem;
    }
    .heading {
      @include h2;
      margin-bottom: 1rem;
      padding: 0 toRem(50) 0 toRem(100);
      width: fit-content;
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      white-space: nowrap;
      @include medium {
        font-size: 2.5rem;
      }
      @include small {
        font-size: 1.5rem;
        padding: 0.5rem 2rem 0.5rem 3rem;
        margin-bottom: 0;
      }
      @include tiny {
        margin-left: -1.5rem;
        z-index: -1;
      }
    }
    .program {
      padding-left: toRem(100);
      @include small {
        padding-left: 3rem;
      }
      @include tiny {
        padding-left: 1.5rem;
      }
    }
  }
}

.program-info-entry {
  position: relative;
  padding: 3rem 0;
  @include small {
    padding: 2rem 0;
  }
  .entry {
    font-size: 1.125rem;
    line-height: leading(36, 18);
    letter-spacing: 0.02em;
    ::v-deep li {
      margin-left: 1rem;
    }
    ::v-deep li,
    ::v-deep span {
      margin-bottom: 0.625rem;
    }
    ::v-deep span {
      display: block;
    }
    @include small {
      font-size: 0.875rem;
      line-height: leading(21, 14);
    }
  }
  &:first-child,
  &:last-child {
    .entry {
      font-size: 1.5rem;
      line-height: leading(36, 24);
      @include small {
        font-size: 1rem;
        line-height: leading(24, 16);
      }
    }
  }
  &:nth-child(2) {
    border-bottom: solid 3px $nandor;
  }
}

.panel-left {
  position: relative;
  height: 100%;
}

.textural-image {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  border-left: solid 3px $nandor;
}

// //////////////////////////////////////////////////// Section Subfooter Slider
#section-subfooter-slider {
  overflow: hidden;
}

.card-container {
  padding-top: toRem(122);
  padding-bottom: toRem(168);
  @include small {
    padding-top: toRem(50);
    padding-bottom: toRem(38);
  }
}

.form-cta-heading {
  @include h3;
  margin-bottom: toRem(45);
  padding-left: toRem(54);
  @include small {
    @include h4;
    margin-bottom: 1.5rem;
  }
}

.panel-left {
  position: relative;
  height: 100%;
  transform: translateY(3px);
}

.warp-image-double {
  position: absolute;
  top: 0;
  right: 0;
  width: 69rem;
  height: 500rem;
  background-image: url('~assets/images/warp-image-double.png');
  background-position: top left;
  background-size: 69rem;
}

#apply-form-card {
  :deep(.panel) {
    &:before,
    &:after {
      background-color: rgba(15, 31, 26, 0.4);
    }
    svg path {
      fill: $aztec;
      fill-opacity: 0.4;
    }
  }
}
</style>
