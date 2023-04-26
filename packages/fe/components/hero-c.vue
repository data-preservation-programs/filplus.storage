<template>
  <div id="hero" class="hero-c">

    <div class="hero-content">
      <div class="grid-center">
        <div class="col-10">
          <div class="inner-content">

            <h1 class="heading" v-html="heading" />

            <Infographic />

            <DatacapTextSpinner />

          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================== Overlays -->
    <Overlay type="noise" />

    <Overlay type="opaque" />

  </div>
</template>

<script>
// ===================================================================== Imports
import Overlay from '@/components/overlay'
import Infographic from '@/components/infographic'
import DatacapTextSpinner from '@/components/spinners/datacap-text'

// ====================================================================== Export
export default {
  name: 'HeroC',

  components: {
    Overlay,
    Infographic,
    DatacapTextSpinner
  },

  props: {
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
  margin-top: -$siteHeaderHeight;
  padding-top: calc($siteHeaderHeight * 2 + 6rem);
  padding-bottom: 9rem;
  z-index: 25;
  @include small {
    padding-top: $siteHeaderHeight * 2;
  }
  @include mini {
    padding-bottom: 0;
  }
}

[class~=grid], [class*=grid-], [class*=grid_] {
  position: relative;
  z-index: 20;
}

.inner-content {
  display: flex;
  flex-direction: column;
}

::v-deep .heading {
  display: flex;
  align-items: center;
  text-align: center;
  font-size: toRem(55);
  font-weight: 500;
  line-height: leading(75, 55);
  margin-bottom: 5rem;
  @include small {
    font-size: toRem(45);
  }
  @include mini {
    @include h3;
  }
}

// ///////////////////////////////////////////////////////////////////// Spinner
.datacap-spinner {
  right: toRem(-65);
  bottom: toRem(-65);
  @include small {
    display: none;
  }
}

// //////////////////////////////////////////////////////////////////// Overlays
.overlay.type__noise {
  opacity: 0.9;
  z-index: 15;
}

.overlay.type__opaque {
  z-index: 10;
}

</style>
