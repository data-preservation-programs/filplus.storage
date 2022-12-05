<template>
  <div id="hero">

    <!-- =========================================================== Heading -->
    <div class="grid">
      <div class="col">
        <div class="inner-content">

          <h1 class="heading" v-html="heading" />

        </div>
      </div>
    </div>

    <!-- ============================================================== Form -->
    <div class="grid-center">
      <div class="col-8">

        <div class="card-container">
          <div class="card">

            <svg
              class="corner"
              viewBox="0 0 92 92"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M -1 94 C 62 94 18 94 91 94 V 94 C 91 78 78 65 62 65 L 59 65 C 42 65 28 51 28 34 L 28 32 L 28 30 C 28 14 15 1 -1 1 Z" fill="black" fill-opacity="0.4" stroke="white" stroke-width="2" />
            </svg>

            <div class="card-content">
              <div class="form-heading">
                {{ formHeading }}
              </div>
              <form class="form">

                <FieldContainer
                  :scaffold="formScaffold.datacap_size_range"
                  :value="getValue('datacap_size')"
                  form-id="datacap_size_selection"
                  class="range-field" />

                <div class="row">
                  <FieldContainer
                    :scaffold="formScaffold.datacap_size_input"
                    :value="getValue('datacap_size')"
                    form-id="datacap_size_selection"
                    class="input-field" />
                  <FieldContainer
                    :scaffold="formScaffold.datacap_size_unit"
                    :value="getValue('datacap_size_unit')"
                    form-id="datacap_size_selection"
                    class="select-field" />
                </div>

                <!-- <ButtonA
                  class="submit-button"
                  @clicked="submitForm">
                  {{ submitButtonText }}
                </ButtonA> -->

              </form>
            </div>

          </div>
        </div>

      </div>
    </div>

    <Overlay type="noise" />

    <Overlay type="opaque" />

    <div class="background-image" />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Overlay from '@/components/overlay'
import FieldContainer from '@/components/form/field-container'
// import ButtonA from '@/components/buttons/button-a'

// ====================================================================== Export
export default {
  name: 'Hero',

  components: {
    Overlay,
    FieldContainer
    // ButtonA
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      application: 'general/application'
    }),
    pageData () {
      return this.siteContent.apply.page_content
    },
    heading () {
      return this.pageData.heading
    },
    form () {
      return this.pageData.form
    },
    formScaffold () {
      return this.form.scaffold
    },
    formHeading () {
      return this.form.heading
    },
    submitButtonText () {
      return this.form.submit_button_text
    }
  },

  methods: {
    ...mapActions({
      validateForm: 'form/validateForm'
    }),
    getValue (modelKey) {
      return this.application[modelKey]
    },
    async submitForm () {
      const incoming = await this.validateForm('datacap_size_selection')
      console.log(incoming)
    }
  }
}
</script>

<style lang="scss" scoped>
$squigglySizing: 5.75rem;
$cardRadius: 1.875rem;

// ///////////////////////////////////////////////////////////////////// General
#hero {
  position: relative;
  height: calc(61.625rem + #{$siteHeaderHeight});
  margin-top: -$siteHeaderHeight;
  padding-top: calc(#{$siteHeaderHeight * 2} + 4rem);
  z-index: 25;
}

[class~=grid], [class*=grid-], [class*=grid_] {
  position: relative;
  z-index: 20;
}

.inner-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

::v-deep .heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  .bubble {
    margin-top: 3rem;
  }
}

// //////////////////////////////////////////////////////////// Image + Overlays
.overlay.type__noise {
  z-index: 15;
}

.overlay.type__opaque {
  z-index: 10;
}

.background-image {
  position: absolute;
  bottom: 0;
  right: -3px;
  width: 100%;
  height: 94.5%;
  background-image: url('~assets/images/lego-backsplash.jpg');
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: bottom right;
  z-index: 5;
}

// //////////////////////////////////////////////////////////////////////// Card
.container {
  position: relative;
}

.card {
  position: relative;
  &:before,
  &:after {
    content: '';
    position: absolute;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 2;
    box-sizing: border-box;
  }
  &:before,
  &:after {
    left: 0;
  }
  &:before {
    top: 0;
    height: $squigglySizing;
    width: calc(100% - #{$squigglySizing});
    border-top-left-radius: $cardRadius;
    border-left: 2px solid $titanWhite;
    border-top: 2px solid $titanWhite;
  }
  &:after {
    top: $squigglySizing;
    height: calc(100% - #{$squigglySizing});
    width: 100%;
    border-bottom-left-radius: $cardRadius;
    border-bottom-right-radius: $cardRadius;
    border: 2px solid white;
    border-top: none;
  }
}

.corner {
  position: absolute;
  right: 0;
  top: 0;
  width: $squigglySizing;
  height: $squigglySizing;
}

.card-content {
  position: relative;
  padding: 3.125rem 7rem 1.875rem 3.4375rem;
  margin-top: 4.8125rem;
  z-index: 10;
}

// //////////////////////////////////////////////////////////////////////// Form
.form-heading {
  margin-bottom: 2.5rem;
  font-size: toRem(24);
  line-height: leading(35, 24);
  font-weight: 500;
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
