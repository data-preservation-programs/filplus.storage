<template>
  <Button
    v-bind="$props"
    :class="['button-x', `theme__${theme}`]"
    v-on="$listeners">
    <div slot-scope="{ loading }" class="inner-content">

      <div :class="['button-content', { hide: loading }]">
        <slot />
      </div>

      <LoaderTripleDot :class="{ show: loading }" />

    </div>
  </Button>
</template>

<script>
// ===================================================================== Imports
import Button from '@/modules/button/components/button'
import LoaderTripleDot from '@/components/spinners/triple-dot'

// ====================================================================== Export
export default {
  name: 'ButtonX',

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
    theme: { // 'clear', 'pink' or 'green'
      type: String,
      required: false,
      default: 'clear'
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
        text-decoration: none;
      }
    }
    &:focus-visible {
      @include focusBoxShadow;
    }
  }
  &[disabled] {
    box-shadow: none;
    opacity: 0.5;
    cursor: no-drop;
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
  :deep(.dot) {
    background-color: $titanWhite;
  }
}

.button-content {
  font-size: toRem(20);
  font-weight: 500;
  transition: 150ms ease-out;
  &.hide {
    opacity: 0;
  }
}

// ////////////////////////////////////////////////////////////////////// Themes
.theme__pink {
  @include h5;
  display: inline-block;
  font-weight: 500;
  color: $mandysPink;
  .button-content {
    display: flex;
    align-items: center;
  }
  :deep(.icon-chevron) {
    transform: rotate(90deg);
    transition: 150ms ease-in;
    width: toRem(12);
    margin-right: toRem(8);
  }
  &:hover {
    color: $mandysPink;
    :deep(.icon-chevron) {
      transform: rotate(90deg) translateY(1rem);
      transition: 150ms ease-out;
    }
  }
}

.theme__green {
  color: $greenYellow;
  .button-content {
    @include p2;
  }
  &:hover {
    color: $greenYellow;
  }
}
</style>
