<template>
  <Radio
    :field="field"
    :force-disabled="forceDisabled"
    v-on="$listeners">

    <template #radio-extra>
      <div class="checker">
        <div class="dot" />
      </div>
    </template>

    <template #label="{ id, label }">
      <label :for="id" class="label">
        {{ label }}
      </label>
    </template>

  </Radio>
</template>

<script>
// ===================================================================== Imports
import Radio from '@/modules/form/fields/radio'

// ====================================================================== Export
export default {
  name: 'FieldRadio',

  components: {
    Radio
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

// ///////////////////////////////////////////////////////////////////// General
.field-radio {
  display: flex;
  flex-direction: row;
  align-items: center;
  &.caution {
    :deep(.radio) {
      &:checked {
        + .checker {
          border-color: $mandysPink;
        }
      }
    }
  }
  &.error {
    :deep(.radio) {
      + .checker {
        border-color: $flamingo;
      }
    }
  }
}

:deep(.radio-wrapper) {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  &:hover {
    .checker {
      transition: 150ms ease-in;
      transform: scale(1.1);
    }
  }
  &:not(:last-child) {
    margin-right: 2.125rem;
  }
}

:deep(.radio-container) {
  position: relative;
}

:deep(.radio) {
  display: flex;
  position: relative;
  width: $dimension;
  height: $dimension;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
  &:checked {
    + .checker {
      animation: shrink-bounce 150ms cubic-bezier(0.4, 0, 0.23, 1);
      border-color: $nandor;
      background-color: $racingGreen;
      .dot {
        display: block;
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
  border-radius: 50%;
  background-color: $racingGreen;
  pointer-events: none;
  z-index: 5;
  transition: border-color 150ms, background-color 150ms, transform 150ms ease-out;
}

.dot {
  display: none;
  clip-path: circle(50%);
  background: radial-gradient(50% 50% at 50% 50%, transparent 0%, $greenYellow 100%);
  height: toRem(12);
  width: toRem(12);
}

.label {
  font-weight: 400;
  cursor: pointer;
  padding-left: 1rem;
}
</style>
