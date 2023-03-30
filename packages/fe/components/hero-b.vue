<template>
  <div id="hero" class="hero-b">

    <!-- =========================================================== Content -->
    <div class="content">
      <div class="grid-center">

        <div class="col-7_mi-9" data-push-left="off-1_mi-0">
          <div class="panel-left">

            <div v-if="label" class="label" v-html="label" />

            <!-- the module style applied here isn't working with scss, only the topmost defined style -->
            <h1 class="heading h3" v-html="heading" />

            <div v-if="subtext" class="subtext" v-html="subtext" />

            <ButtonX
              v-if="heroButton"
              :to="heroButton.href"
              :theme="heroButton.theme"
              :tag="heroButton.type">
              <Chevron
                v-if="heroButton.icon === 'chevron'" />
              <div class="text" v-html="heroButton.label" />
            </ButtonX>

          </div>
        </div>

        <div class="col-4_sm-3_mi-2">
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

// import IconQuestionMark from '@/components/icons/question-mark'

// ====================================================================== Export
export default {
  name: 'HeroB',

  components: {
    ButtonX,
    Chevron
    // IconQuestionMark
  },

  props: {
    label: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    heading: {
      type: String,
      required: true
    },
    tooltip: {
      type: [String, Boolean],
      required: false,
      default: false
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
  min-height: calc(40.625rem + #{$siteHeaderHeight});
  margin-top: -$siteHeaderHeight;
  padding-top: $siteHeaderHeight * 1.5;
  padding-bottom: math.div($siteHeaderHeight, 2);
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
    display: inline-block;
    color: $greenYellow;
    .tooltip {
      display: inline-block;
      margin: 0 0.5rem;
      background-image: url(icons/question-mark.svg);
      height: toRem(25);
      width: toRem(25);
      &[data-tooltip] {
        &:before {
          top: 50%;
          left: calc(100% + 5px);
          transform: translate(0.5rem, -50%) rotate(-90deg);
          border-bottom-width: 0.5rem;
          border-bottom-color: $dodgerBlue;
        }
        &:after {
          top: 50%;
          left: calc(100% + 1rem);
          transform: translate(0.5rem, -50%);
          z-index: 1;
          color: $titanWhite;
          background-color: $dodgerBlue;
          white-space: break-spaces;
          padding: 1rem;
          width: 9rem;
        }
        &:hover {
          &:before {
            transform: translate(0, -50%) rotate(-90deg);
          }
          &:after {
            transform: translate(0, -50%);
          }
        }
      }
    }
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
