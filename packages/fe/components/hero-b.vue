<template>
  <div id="hero">

    <!-- =========================================================== Content -->
    <div class="content">
      <div class="grid-center">

        <div :class="contentCols" data-push-left="off-1_mi-0">
          <div class="panel-left">

            <div v-if="label" class="label" v-html="label" />

            <h1 class="heading h3" v-html="heading" />

            <div v-if="subtext" class="subtext" v-html="subtext" />

            <div v-if="Object.keys(heroButton).length >= 3">
              <ButtonX
                :to="heroButton.href"
                :theme="heroButton.theme"
                :tag="heroButton.type">
                {{ heroButton.label }}
              </ButtonX>
            </div>

          </div>
        </div>

        <div class="col-4_sm-3_mi-2" data-push-left="off-1">
          <div class="panel-right">
            <div class="warp-image-double" />
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import ButtonX from '@/components/buttons/button-x'

// ====================================================================== Export
export default {
  name: 'HeroB',

  components: {
    ButtonX
  },

  props: {
    contentCols: {
      type: String,
      required: false,
      default: 'col-6_sm-7_mi-9'
    },
    label: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    heading: {
      type: String,
      required: true
    },
    subtext: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    heroButton: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#hero {
  position: relative;
  margin-top: -$siteHeaderHeight;
  padding-top: $siteHeaderHeight * 2;
  // border-bottom: 2px solid $nandor;
  overflow: hidden;
  z-index: 25;
}

[class~=grid], [class*=grid-], [class*=grid_] {
  position: relative;
  z-index: 20;
}

.panel-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 9.375rem;
  padding-bottom: 14rem;
}

.label {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 1.875rem;
  @include tiny {
    line-height: 1.2;
  }
}

::v-deep .heading {
  margin-bottom: 2rem;
  @include mini {
    font-size: toRem(30);
  }
  @include tiny {
    font-size: toRem(24);
  }
  .highlight {
    color: $greenYellow;
  }
}

.subtext {
  @include headingHighlight;
  font-weight: 600;
  margin-bottom: 2rem;
  @include mini {
    font-size: toRem(30);
  }
  @include tiny {
    font-size: toRem(24);
  }
}

// //////////////////////////////////////////////////////////// Image + Overlays
// .overlay.type__noise {
//   z-index: 15;
// }
//
// .overlay.type__opaque {
//   z-index: 10;
// }

// ////////////////////////////////////////////////////////////////// Warp Image
.panel-right {
  position: relative;
  top: -2.6875rem;
  height: 100%;
  @include small {
    top: -3.25rem;
  }
}

.warp-image-double {
  position: absolute;
  top: 0;
  left: 0;
  width: 45rem;
  height: 500rem;
  background-image: url('~assets/images/warp-image-double.png');
  background-position: top left;
  background-size: 45rem;
  @include tiny {
    width: calc(100% + 100vw * 0.041665 + 2rem);
  }
}
</style>
