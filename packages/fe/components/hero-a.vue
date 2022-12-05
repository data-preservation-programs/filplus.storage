<template>
  <div id="hero">

    <div class="content">
      <!-- ========================================================= Heading -->
      <div class="grid-center">
        <div :class="headingCols">
          <div class="inner-content">

            <div v-if="label" class="label" v-html="label" />

            <h1 class="heading" v-html="heading" />

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

    <div class="background-image" />

  </div>
</template>

<script>
// ===================================================================== Imports
import Overlay from '@/components/overlay'

// ====================================================================== Export
export default {
  name: 'HeroA',

  components: {
    Overlay
  },

  props: {
    headingCols: {
      type: String,
      required: false,
      default: 'col-10'
    },
    contentCols: {
      type: String,
      required: false,
      default: 'col-8'
    },
    label: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    heading: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#hero {
  position: relative;
  height: calc(61.625rem + #{$siteHeaderHeight});
  margin-top: -$siteHeaderHeight;
  padding-top: $siteHeaderHeight * 2;
  z-index: 25;
}

[class~=grid], [class*=grid-], [class*=grid_] {
  position: relative;
  z-index: 20;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding-bottom: $siteHeaderHeight;
}

.inner-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.label {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 1.875rem;
}

::v-deep .heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
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
  width: calc(100% + 3px);
  height: 94.5%;
  background-image: url('~assets/images/lego-backsplash.jpg');
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: bottom right;
  z-index: 5;
}
</style>
