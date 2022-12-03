<template>
  <Button
    v-bind="$props"
    class="button-x"
    v-on="$listeners">

    <slot />

  </Button>
</template>

<script>
// ===================================================================== Imports
import Button from '@/modules/button/components/button'

// ====================================================================== Export
export default {
  name: 'ButtonX',

  components: {
    Button
  },

  props: {
    tag: { // button, 'a' or nuxt-link
      type: String,
      required: false,
      default: 'button'
    },
    to: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    target: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    selected: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.button {
  white-space: nowrap;
  font-size: toRem(20);
  font-weight: 500;
  cursor: pointer;
  &:not([disabled]) {
    &:focus-visible {
      @include focusBoxShadow;
    }
  }
  &[disabled] {
    box-shadow: none;
    cursor: no-drop;
  }
}
</style>
