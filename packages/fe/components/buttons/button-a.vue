<template>
  <Button
    v-bind="$props"
    :class="['button-a', `format__${format}`, `theme__${theme}`]"
    v-on="$listeners">
    <div slot-scope="{ loading }" class="inner-content">

      <LoaderTripleDot :class="{ show: loading }" />

      <div :class="['button-content', { hide: loading }]">
        <slot />
      </div>

    </div>
  </Button>
</template>

<script>
// ===================================================================== Imports
import Button from '@/modules/button/components/button'
import LoaderTripleDot from '@/components/spinners/triple-dot'

// ====================================================================== Export
export default {
  name: 'ButtonA',

  components: {
    Button,
    LoaderTripleDot
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
    loader: {
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
    format: { // 'mini', 'regular'
      type: String,
      required: false,
      default: 'regular'
    },
    theme: {
      type: String,
      required: false,
      default: 'green'
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.button {
  display: inline-block;
  position: relative;
  padding: toRem(14) 1.25rem;
  border-radius: 3rem;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  &:not([disabled]) {
    &:hover {
      transform: scale(1.05);
    }
    &:focus-visible {
      @include focusBoxShadow;
    }
  }
  &[disabled] {
    box-shadow: none;
    cursor: no-drop;
    opacity: 0.5;
  }
}

.triple-dot-loader,
.button-content {
  width: 100%;
  height: 100%;
}

.triple-dot-loader {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  &.show {
    opacity: 1;
  }
}

.button-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  line-height: 1;
  &.hide {
    opacity: 0;
  }
}

// ////////////////////////////////////////////////////////////////////// Themes
.theme__green {
  color: $aztec;
  background-color: $greenYellow;
}

.theme__blue {
  color: $aztec;
  background-color: $perano;
}

.theme__green-outline {
  color: $greenYellow;
  border: 2px solid $greenYellow;
  &:not([disabled]) {
    &:hover {
      color: $lima;
      border-color: $lima;
    }
  }
}
</style>
