<template>
  <Input
    :field="field"
    :disabled="disabled"
    v-on="$listeners" />
</template>

<script>
// ===================================================================== Imports
import Input from '@/modules/form/fields/input'

// ====================================================================== Export
export default {
  name: 'FieldInput',

  components: {
    Input
  },

  props: {
    field: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 3.125rem;

// ///////////////////////////////////////////////////////////////////// General
.field-input {
  height: $height;
  &.in-progress {
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
      border-color: rgba(246, 245, 255, 0.25);
    }
  }
}

:deep(.input) {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 toRem(12);
  border: 2px solid $mineralGreen;
  border-radius: toRem(5);
  transition: 150ms ease-in-out;
  @include placeholder {
    color: rgba($aquaSqueeze, 0.7);
    font-style: italic;
    opacity: 1;
    transition: 150ms ease-out;
  }
}
</style>
