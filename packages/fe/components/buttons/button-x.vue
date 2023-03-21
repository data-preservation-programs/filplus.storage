<template>
  <Button
    v-bind="$props"
    :class="['button-x', `theme__${theme}`]"
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
display: inline-block;
  @include h5;
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
    text-decoration: underline;
  }
}

.theme__mineral-green {
  background-color: rgba($mineralGreen, 0.5);
  border-radius: toRem(3);
  .button-content{
    @include p3;
    line-height: 1.8;
    font-weight: 500;
    padding: 0 toRem(13);
  }
  &:not([disabled]) {
    &:hover {
      background-color: rgba($mineralGreen, 1);
      :deep(.button-content) {
        text-decoration: none;
      }
    }
  }
}
</style>
