<template>
  <div :class="`page page-${tag} container`">

    <!-- ========================================================== Overlays -->
    <Overlay type="noise" />

    <!-- ================================================== Section Overview -->
    <section
      id="section-overview"
      class="section">

      <Squigglie
        :percent-left="6"
        orientation="down"
        color="nandor"
        :thick="true"
        class="faq-top-border" />

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
    <section
      id="section-graphics"
      class="section">

      <Squigglie
        :percent-left="90"
        orientation="up"
        color="nandor"
        :thick="true"
        class="faq-top-border" />

      <div class="grid">
        <div
          v-for="(card, i) in graphics"
          :key="`graphic-card-${i}`"
          class="col-4_sm-12"
          data-push-left="off-0_sm-0"
          :data-col-id="`card-${i}`">
          <div class="graphic-card">

            <div class="graphic">
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
    <section
      id="section-program-info"
      class="section">

      <div class="grid-noGutter">

        <div class="col-4_lg-3">
          <div class="panel-left">
            <div class="textural-image"></div>
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
                  :thick="true"
                  class="faq-top-border" />

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

    <!-- ========================================== Section Subfooter Slider -->
    <section
      id="section-subfooter-slider"
      class="section">

      <Squigglie
        :percent-left="90"
        orientation="down"
        color="nandor"
        :thick="true"
        class="faq-top-border" />

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

            <Card
              id="apply-form-card"
              :icon-text="submitButtonText"
              :class="{ highlighted: applyFormHighlighted }"
              corner-position="bottom-right"
              icon="arrow"
              @clicked="submitForm">
              <template v-if="formScaffold">

                <div class="form-heading">
                  {{ formHeading }}
                </div>

                <form class="form">

                  <FieldContainer
                    :scaffold="formScaffold.total_datacap_size_range"
                    field-key="total_datacap_size_range"
                    form-id="filplus_application"
                    class="range-field" />

                  <div class="row">
                    <FieldContainer
                      :scaffold="formScaffold.total_datacap_size_input"
                      field-key="total_datacap_size_input"
                      form-id="filplus_application"
                      class="input-field" />
                    <FieldContainer
                      :scaffold="formScaffold.total_datacap_size_unit"
                      field-key="total_datacap_size_unit"
                      form-id="filplus_application"
                      class="select-field" />
                  </div>

                </form>

              </template>
            </Card>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Overlay from '@/components/overlay'
import Squigglie from '@/components/squigglie'
import Card from '@/components/card'
import FieldContainer from '@/components/form/field-container'

import HomePage2Data from '@/content/pages/home-2.json'
import ApplyPageData from '@/content/pages/apply.json'

// ====================================================================== Export
export default {
  name: 'ApplyPage',

  components: {
    Overlay,
    Squigglie,
    Card,
    FieldContainer
  },

  data () {
    return {
      tag: 'index'
    }
  },

  async fetch ({ app, store }) {
    await store.dispatch('general/getBaseData', { key: 'index', data: HomePage2Data })
    await store.dispatch('general/getBaseData', { key: 'apply', data: ApplyPageData })
    const application = await store.dispatch('account/setHubspotOptInData', store.getters['auth/account'])
    await app.$form('filplus_application').register(application)
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      applyFormHighlighted: 'general/applyFormHighlighted'
    }),
    generalPageData () {
      return this.siteContent.general
    },
    pageData () {
      return this.siteContent[this.tag].page_content
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
    program () {
      return this.pageData.section_program.entries
    },
    subfooterCtaHeading () {
      return this.pageData.section_subfooter_slider.heading
    },
    form () {
      return this.siteContent.apply.page_content.form
    },
    formScaffold () {
      return this.form.scaffold
    },
    formHeading () {
      return this.form.heading
    },
    submitButtonText () {
      return this.form.submit_button_text
    },
    submitThresholdBottom () {
      return this.generalPageData.forms.submit_threshold_bottom
    },
    submitThresholdMiddle () {
      return this.generalPageData.forms.submit_threshold_middle
    },
    submitThresholdTop () {
      return this.generalPageData.forms.submit_threshold_top
    }
  },

  mounted () {
    this.$nextTick(() => {
      const highlightForm = this.$route.query.highlight_form
      if (highlightForm) {
        this.$highlightApplyForm()
      }
    })
  },

  methods: {
    ...mapActions({
      validateForm: 'form/validateForm'
    }),
    async submitForm (e) {
      e.preventDefault()
      const bottom = this.submitThresholdBottom
      const middle = this.submitThresholdMiddle
      const top = this.submitThresholdTop
      const rangeField = this.$field('total_datacap_size_range|filplus_application').get()
      const bytes = rangeField.value
      const pass = await this.$handleFormRedirection(bytes, bottom, top)
      if (pass) {
        if (bytes >= bottom && bytes < middle) {
          this.$gtm.push({ event: 'redirect_notary_selection' })
          this.$router.push('/apply/general/notaries')
        } else if (bytes >= middle && bytes <= top) {
          this.$gtm.push({ event: 'redirect_lda' })
          this.$router.push('/apply/large')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$squigglySizing: 5.75rem;
$cardRadius: 1.875rem;

// ///////////////////////////////////////////////////////////////////// General
.page-index {
  position: relative;
  overflow: hidden;
}

.overlay.type__noise {
  z-index: 5;
}

.container,
.section {
  position: relative;
  z-index: 5;
}

// //////////////////////////////////////////////////////////// Section Overview
// -----------------------------------------------------------------------------
#section-overview {
  margin-top: 10rem;
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
// -----------------------------------------------------------------------------
#section-graphics {
  div[data-col-id="card-1"] {
    border-left: solid 3px $nandor;
    border-right: solid 3px $nandor;
    @include small {
      border: none;
    }
    .graphic {
      transform: scale(1.2);
      @include small {
        transform: scale(1.1);
      }
    }
  }
  div[data-col-id="card-0"],
  div[data-col-id="card-1"],
  div[data-col-id="card-2"] {
    position: relative;
    @include small {
      &:not(:last-child) {
        border-bottom: solid 3px $nandor;
        &:before,
        &:after {
          content: '';
          position: absolute;
          bottom: -3px;
          border-bottom: solid 3px $nandor;
          width: 4.1665vw;
        }
        &:before {
          left: -4.1665vw;
        }
        &:after {
          left: 100%;
        }
      }
    }
  }
}
.graphic-row {
  display: flex;
  justify-content: space-between;
}

.graphic-card,
.text-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.graphic-card {
  padding: 3.75rem 2.75rem;
  align-items: center;
  @include small {
    padding: 2.25rem 1.5rem;
  }
  .graphic {
    height: toRem(160);
    width: toRem(160);
    display: flex;
    justify-content: center;
    margin-top: 3rem;
    margin-bottom: 4.75rem;
    @include medium {
      margin: 1.5rem 0;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}

.text-content {
  height: toRem(134);
  .title,
  .description {
    text-align: center;
  }
  .title {
    @include h3;
  }
  .description {
    font-size: toRem(21);
    line-height: leading(30, 21);
    letter-spacing: 0.02em;
  }
  @include medium {
    height: unset;
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
// -----------------------------------------------------------------------------
#section-program-info {
  border-top: solid 3px $nandor;
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
  width: toRem(651);
  height: 100%;
  background-image: url('/images/textural-splash.jpg');
  background-position: top right;
  background-size: cover;
  border-left: solid 3px $nandor;
}

// //////////////////////////////////////////////////// Section Subfooter Slider
// -----------------------------------------------------------------------------
.card-container {
  padding-top: toRem(122);
  padding-bottom: toRem(168);
  @include small {
    padding-top: toRem(50);
    padding-bottom: toRem(38);
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

.form-cta-heading {
  @include h3;
  margin-bottom: toRem(45);
  padding-left: toRem(54);
  @include small {
    @include h4;
    margin-bottom: 1.5rem;
  }
}

.form-heading {
  margin-bottom: 2.5rem;
  font-size: toRem(24);
  line-height: leading(35, 24);
  font-weight: 500;
  @include mini {
    font-size: toRem(18);
  }
}

.field-container {
  :deep(.field-label) {
    display: none;
  }
}

.range-field {
  margin-bottom: 2.5rem;
}

.row {
  display: flex;
  flex-direction: row;
}

.input-field {
  position: relative;
  width: 6.25rem;
  margin-right: 1.125rem;
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: calc(100% + 0.4375rem);
    width: 0.25rem;
    height: 2px;
    background-color: $titanWhite;
  }
}

.select-field {
  width: 3.75rem;
}

</style>
