<template>
  <Input
    :field="field"
    :force-disabled="forceDisabled"
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
    forceDisabled: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 4rem;

// ///////////////////////////////////////////////////////////////////// General
.field-input {
  height: $height;
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

:deep(.input) {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 2px solid $titanWhite;
  transition: 150ms ease-in-out;
  @include placeholder {
    color: rgba($aquaSqueeze, 0.7);
    font-size: toRem(18);
    font-weight: 400;
    font-style: italic;
    opacity: 1;
    transition: 150ms ease-out;
  }
  &:focus {
    font-size: toRem(20);
    @include placeholder {
      transition: 150ms ease-in;
      font-size: toRem(20);
    }
  }
}
</style>
