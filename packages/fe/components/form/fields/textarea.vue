<template>
  <Textarea
    :field="field"
    :force-disabled="forceDisabled"
    v-on="$listeners" />
</template>

<script>
// ===================================================================== Imports
import Textarea from '@/modules/form/fields/textarea'

// ====================================================================== Export
export default {
  name: 'FieldTextarea',

  components: {
    Textarea
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
// ///////////////////////////////////////////////////////////////////// General
.field-textarea {
  height: 10rem;
  transition: 150ms ease-out;
  &.in-progress {
    :deep(.textarea) {
      border-color: $mandysPink;
    }
  }
  &.error {
    :deep(.textarea) {
      border-color: $flamingo;
    }
  }
  &.disabled {
    cursor: no-drop;
    :deep(.textarea) {
      border-bottom-color: rgba(227, 211, 192, 0.25);
      overflow-y: scroll;
    }
  }
}

:deep(.textarea) {
  padding: 1.5rem;
  border: 2px solid $nandor;
  border-radius: 0.625rem;
  transition: 150ms ease-in-out;
  @include placeholder {
    color: rgba($aquaSqueeze, 0.7);
    font-size: toRem(18);
    font-weight: 400;
    font-style: italic;
    opacity: 1;
  }
  &:focus {
    border-color: $titanWhite;
  }
}
</style>
