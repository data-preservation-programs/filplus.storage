<template>
  <Button
    v-bind="$props"
    :class="['button-x', theme.length > 0 ? `theme__${theme}` : '' ]"
    v-on="$listeners">
    <div class="button-content">

      <slot />

    </div>
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
    },
    theme: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.button {
  white-space: nowrap;
  cursor: pointer;
  &:not([disabled]) {
    &:hover {
      .button-content {
        transition: 150ms ease-in;
        text-decoration: underline;
      }
    }
    &:focus-visible {
      @include focusBoxShadow;
    }
  }
  &[disabled] {
    box-shadow: none;
    cursor: no-drop;
  }
}

.button-content {
  font-size: toRem(20);
  font-weight: 500;
  transition: 150ms ease-out;
}

// ////////////////////////////////////////////////////////////////////// Themes
.theme__pink {
  @include h5;
  font-weight: 500;
  color: $mandysPink;
  &:hover {
    color: $mandysPink;
  }
}

</style>
