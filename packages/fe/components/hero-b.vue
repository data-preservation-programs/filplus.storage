<template>
  <div id="hero" class="hero-b">

    <div class="content">
      <div class="grid-center">

        <!-- ======================================================= Content -->
        <div class="col-7_mi-9" data-push-left="off-1_mi-0">
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
              <div class="text" v-html="heroButton.label" />
            </ButtonX>

          </div>
        </div>

        <!-- =============================================== Warp grid + KYC -->
        <div class="col-4_sm-3_mi-2">
          <div class="panel-right">

            <template v-if="account">
              <!-- <div v-if="!account.kyc || account.kyc && account.kyc.event !== 'failure'" class="kyc"> -->
              <div class="kyc">
                <div class="kyc-heading" v-html="kycHeading" />
                <KycButton
                  tooltip-align="top"
                  theme="full"
                  class="kyc-button" />
              </div>
            </template>

            <div class="warp-image-double" />

          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import ButtonX from '@/components/buttons/button-x'
import KycButton from '@/components/kyc-button'

import Chevron from '@/components/icons/chevron'

// ====================================================================== Export
export default {
  name: 'HeroB',

  components: {
    ButtonX,
    KycButton,
    Chevron
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
    },
    kycHeading: {
      type: [String, Boolean],
      required: false,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      account: 'auth/account'
    })
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#hero {
  display: grid;
  position: relative;
  min-height: toRem(660);
  overflow: hidden;
  z-index: 25;
}

[class~=grid], [class*=grid-], [class*=grid_] {
  position: relative;
  height: 100%;
  z-index: 20;
}

.content {
  height: 100%;
}

.panel-left,
.panel-right {
  height: 100%;
  padding-top: $siteHeaderHeight * 1.5;
  padding-bottom: math.div($siteHeaderHeight, 2);
}

.panel-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.panel-right {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  padding-bottom: toRem(44); // 60px - 1rem from the column
}

// ////////////////////////////////////////////////////// [Panel] Left (content)
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
          border-bottom-color: $blueRibbon;
        }
        &:after {
          top: 50%;
          left: calc(100% + 1rem);
          transform: translate(0.5rem, -50%);
          z-index: 1;
          color: $titanWhite;
          background-color: $blueRibbon;
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

// ///////////////////////////////////////////// [Panel] Right (Warp grid + KYC)
.kyc {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 9%;
  left: 23%;
  width: 75%;
  padding: toRem(33);
  background-color: $aztec;
  border: 3px solid $nandor;
  border-radius: toRem(10);
  z-index: 10;
}

.kyc-heading {
  @include h5;
  text-align: center;
}

.kyc-button {
  margin-top: toRem(33);
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
