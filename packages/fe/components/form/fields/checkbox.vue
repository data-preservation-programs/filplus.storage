<template>
  <Checkbox
    :field="field"
    :force-disabled="forceDisabled"
    v-on="$listeners">

    <template #checkbox-extra>
      <div class="checker">
        <IconCheckmark />
      </div>
    </template>

    <template #label="{ id, label }">
      <label :for="id" class="label">
        {{ label }}
      </label>
    </template>

  </Checkbox>
</template>

<script>
// ===================================================================== Imports
import Checkbox from '@/modules/form/fields/checkbox'

import IconCheckmark from '@/components/icons/checkmark'

// ====================================================================== Export
export default {
  name: 'FieldCheckbox',

  components: {
    Checkbox,
    IconCheckmark
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
$dimension: 1.625rem;

@keyframes shrink-bounce {
  0% { transform: scale(1); }
  33% { transform: scale(0.85); }
  100% { transform: scale(1); }
}

@keyframes checkbox-check {
  0% {
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

// ///////////////////////////////////////////////////////////////////// General
.field-checkbox {
  display: flex;
  flex-direction: row;
  align-items: center;
  &:not(.disabled) {
    :deep(.checkbox-wrapper),
    :deep(.checkbox),
    .label {
      cursor: pointer;
    }
  }
  &.disabled {
    .checkbox-wrapper,
    .checkbox,
    .label {
      cursor: no-drop;
    }
  }
  &.in-progress {
    .checkbox + .checker {
      border-color: $mandysPink;
    }
  }
  &.error {
    .checkbox + .checker {
      border-color: $flamingo;
    }
  }
}

:deep(.checkbox-wrapper) {
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover:not(.disabled) {
    .checker {
      transition: 150ms ease-in;
      transform: scale(1.1);
    }
  }
  &:not(:last-child) {
    margin-right: 2.125rem;
  }
}

:deep(.checkbox-container) {
  position: relative;
}

:deep(.checkbox) {
  display: flex;
  position: relative;
  width: $dimension;
  height: $dimension;
  opacity: 0;
  z-index: 10;
  &:checked, &.disabled {
    + .checker {
      animation: shrink-bounce 150ms cubic-bezier(0.4, 0, 0.23, 1);
      border-color: $nandor;
      background-color: $aztec;
      .icon-checkmark {
        animation: checkbox-check 75ms 200ms cubic-bezier(0.4, 0, 0.23, 1) forwards;
      }
    }
  }
  &:focus-visible {
    + .checker {
      @include focusBoxShadow;
    }
  }
}

.checker {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: $dimension;
  height: $dimension;
  border: 2px solid $nandor;
  border-radius: 0.625rem;
  background-color: $aztec;
  pointer-events: none;
  z-index: 1;
  transition: border-color 150ms, background-color 150ms, transform 150ms ease-out;
}

.icon-checkmark {
  display: block;
  width: 0.875rem;
  opacity: 0;
}

.label {
  font-weight: 400;
  padding-left: 1rem;
  line-height: leading(26, 18);
}
</style>
