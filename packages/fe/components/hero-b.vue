<template>
  <div id="hero">

    <!-- =========================================================== Content -->
    <div class="content">
      <div class="grid-center">

        <div class="col-6" data-push-left="off-1">
          <div class="panel-left">

            <div v-if="label" class="label" v-html="label" />

            <h1 class="heading h3" v-html="heading" />

            <div v-if="subtext" class="subtext" v-html="subtext" />

          </div>
        </div>

        <div class="col-4" data-push-left="off-1">
          <div class="panel-right">
            <div class="warp-image-double" />
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================================== Overlays -->
    <!-- <Overlay type="noise" />

    <Overlay type="opaque" />

    <div class="background-image" /> -->

  </div>
</template>

<script>
// ===================================================================== Imports
// import Overlay from '@/components/overlay'

// ====================================================================== Export
export default {
  name: 'HeroA',

  components: {
    // Overlay
  },

  props: {
    label: {
      type: String,
      required: true
    },
    heading: {
      type: String,
      required: true
    },
    subtext: {
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
  margin-top: -$siteHeaderHeight;
  padding-top: $siteHeaderHeight * 2;
  border-bottom: 2px solid $nandor;
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
}

::v-deep .heading {
  margin-bottom: 2rem;
  .highlight {
    color: $greenYellow;
  }
}

.subtext {
  @include headingHighlight;
  font-weight: 600;
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
  height: 100%;
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
}
</style>
