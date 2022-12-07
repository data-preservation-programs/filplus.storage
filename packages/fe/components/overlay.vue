<template>

  <div :class="['overlay', `type__${type}`]" />

</template>

<script>
// ====================================================================== Export
export default {
  name: 'Overlay',

  props: {
    type: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.type__opaque {
  background-color: rgba(15, 31, 26, 0.55); // $aztec
  mix-blend-mode: multiply;
}

.type__noise {
  background-image: url('~assets/images/noise-pattern.png');
  background-size: 6.25rem;
  opacity: 0.5;
}
</style>
