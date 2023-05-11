<template>
  <Typeahead
    :field="field"
    :force-disabled="forceDisabled"
    v-on="$listeners">

    <template #option-native-default-text>
      Select an option
    </template>

    <template #option-custom="{ option, highlighted, selected, highlightText }">
      <div
        :class="['option', { highlighted, selected }]"
        v-html="highlightText(option)" />
    </template>

  </Typeahead>
</template>

<script>
// ===================================================================== Imports
import Typeahead from '@/modules/form/fields/typeahead'

// ====================================================================== Export
export default {
  name: 'FieldTypeahead',

  components: {
    Typeahead
  },

  props: {
    field: {
      type: Object,
      required: true
    },
    forceDisabled: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 2.5rem;

// ///////////////////////////////////////////////////////////////////// General
.field-typeahead {
  height: $height;
  &.dropdown-open {
    @media (hover: hover) {
      &:not(.no-results) {
        :deep(.input) {
          border-color: transparent;
        }
      }
    }
  }
  &.caution {
    :deep(.input) {
      border-color: $mandysPink;
    }
  }
  &.error {
    :deep(.input) {
      border-color: $flamingo;
    }
  }
  &.disabled {
    cursor: no-drop;
    :deep(.input) {
      border-bottom-color: rgba(246, 245, 255, 0.25);
    }
  }
}

:deep(.input-container) {
  z-index: 10;
}

:deep(.input) {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-bottom: 2px solid $titanWhite;
  appearance: none;
  transition: 150ms ease-in-out;
  @include placeholder {
    opacity: 0;
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }
  &:focus {
    font-size: toRem(20);
  }
  &:focus-visible {
    @include focusBoxShadow;
  }
}

// //////////////////////////////////////////////////////////////////// Dropdown
:deep(div.dropdown) {
  position: absolute;
  top: calc(100% - 2px);
  max-height: $height * 5.5;
  background-color: $aztec;
  border: 2px solid $titanWhite;
  border-radius: 0.3125rem;
}

:deep(div.selection-window) {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

:deep(div.option) {
  padding: 0.5rem 0.75rem;
  transition: 150ms ease-out;
  &.highlighted {
    transition: 150ms ease-in;
    background-color: rgba(white, 0.1);
  }
  .highlight {
    font-weight: 700;
  }
}
</style>
