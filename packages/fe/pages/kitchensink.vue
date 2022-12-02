<template>
  <div class="page page-kitchensink">

    <BackgroundGradients />

  </div>
</template>

<script>
// ====================================================================== Import
import BackgroundGradients from '@/components/background-gradients'

// ====================================================================== Export
export default {
  name: 'KitchenSink',

  components: {
    BackgroundGradients
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-kitchensink {
  position: relative;
  height: 200rem;
  width: 100vw;
  background-color: $aztec;
}
</style>
