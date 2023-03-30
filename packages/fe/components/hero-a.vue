<template>
  <div id="hero" class="hero-a">

    <div class="hero-content">
      <!-- ========================================================= Heading -->
      <div class="grid-center">
        <div :class="headingCols">
          <div class="inner-content">

            <div v-if="label" class="label" v-html="label" />

            <h1 :class="['heading', `direction__${contentDirection}`]" v-html="heading" />

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
      </div>

      <!-- ============================================================ Form -->
      <div class="grid-center">
        <div :class="contentCols">
          <slot />
        </div>
      </div>
    </div>

    <!-- ========================================================== Overlays -->
    <Overlay type="noise" />

    <Overlay type="opaque" />

    <div
      :style="{ backgroundImage: `url(${backgroundImageImport})` }"
      class="background-image" />

  </div>
</template>

<script>
// ===================================================================== Imports
import Overlay from '@/components/overlay'
import ButtonX from '@/components/buttons/button-x'
import Chevron from '@/components/icons/chevron'

// ====================================================================== Export
export default {
  name: 'HeroA',

  components: {
    Overlay,
    ButtonX,
    Chevron
  },

  props: {
    headingCols: {
      type: String,
      required: false,
      default: 'col-12_mi-10_ti-12'
    },
    contentCols: {
      type: String,
      required: false,
      default: 'col-8_sm-10_mi-12'
    },
    contentDirection: {
      type: String,
      required: false,
      default: 'vertical'
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
    backgroundImage: {
      type: String,
      required: false,
      default: 'lego-backsplash.jpg'
    },
    heroButton: {
      type: [Object, Boolean],
      required: false,
      default: false
    }
  },

  computed: {
    backgroundImageImport () {
      return require(`~/assets/images/${this.backgroundImage}`)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#hero {
  position: relative;
  height: calc(40.625rem + #{$siteHeaderHeight});
  margin-top: -$siteHeaderHeight;
  padding-top: $siteHeaderHeight * 2;
  z-index: 25;
  @include large {
    height: unset;
  }
}

[class~=grid], [class*=grid-], [class*=grid_] {
  position: relative;
  z-index: 20;
}

.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  @include large {
    padding-top: 5rem;
  }
  @include small {
    height: unset;
  }
  @include mini {
    padding-top: 3rem;
  }
}

.inner-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .button {
    margin-top: 2rem;
  }
}

.label {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 1.875rem;
}

::v-deep .heading {
  display: flex;
  align-items: center;
  line-height: 1.1;
  @include h2;
  &.direction__vertical {
    flex-direction: column;
    text-align: center;
  }
  &.direction__horizontal {
    flex-direction: row;
    justify-content: center;
  }
  @include small {
    font-size: toRem(55);
  }
  @include mini {
    font-size: toRem(35);
  }
}

// //////////////////////////////////////////////////////////// Image + Overlays
.overlay.type__noise {
  opacity: 0.9;
  z-index: 15;
}

.overlay.type__opaque {
  z-index: 10;
}

.background-image {
  position: absolute;
  bottom: 0;
  right: -3px;
  width: calc(100% + 3px);
  height: 94.5%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom right;
  z-index: 5;
}
</style>
