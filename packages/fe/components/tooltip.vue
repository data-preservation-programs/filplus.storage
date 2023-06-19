<template>
  <div class="tooltip">

    <slot name="tooltip-trigger" />

    <div :class="['tooltip-content-wrapper', align]">
      <slot name="tooltip-content" />
    </div>

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Tooltip',

  props: {
    align: {
      type: String,
      required: false,
      default: 'right'
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.tooltip {
  position: relative;
  z-index: 1000;
  &:hover {
    .tooltip-content-wrapper {
      transition: all 150ms ease-in;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      &.left,
      &.right {
        transform: translate(0, -50%);
      }
      &.top,
      &.bottom {
        transform: translate(-50%, 0);
      }
    }
  }
}

.tooltip-content-wrapper { // default align === right
  position: absolute;
  left: 100%;
  top: 50%;
  padding-left: 1rem;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translate(0.5rem, -50%);
  transition: all 150ms ease-in;
  &.left {
    left: auto;
    right: 100%;
    padding-right: 1rem;
    transform: translate(-0.5rem, -50%);
  }
  &.top {
    top: auto;
    bottom: 100%;
    left: 50%;
    padding-bottom: 1rem;
    transform: translate(-50%, -0.5rem);
  }
  &.bottom {
    top: 100%;
    left: 50%;
    padding-top: 1rem;
    transform: translate(-50%, 0.5rem);
  }
}
</style>
