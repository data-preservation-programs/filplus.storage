<template>
  <div id="hero" class="hero-b">

    <!-- =========================================================== Content -->
    <div class="content">
      <div class="grid-center">

        <div :class="contentCols" data-push-left="off-1_mi-0">
          <div class="panel-left">

            <div v-if="label" class="label" v-html="label" />

            <h1 class="heading h3" v-html="heading" />

            <div v-if="subtext" class="subtext" v-html="subtext" />

            <ButtonX
              v-if="heroButton"
              :to="heroButton.href"
              :theme="heroButton.theme"
              :tag="heroButton.type">
              <Chevron
                v-if="heroButton.icon === 'chevron'" />
              {{ heroButton.label }}
            </ButtonX>

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
import Chevron from '@/components/icons/chevron'

// ====================================================================== Export
export default {
  name: 'HeroB',

  components: {
    ButtonX,
    Chevron
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
      type: [Object, Boolean],
      required: false,
      default: false
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
  align-items: flex-start;
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
