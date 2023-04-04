<template>
  <div :class="['field field-checkbox', state, { disabled }]">

    <div
      v-for="(option, index) in options"
      :key="index"
      :class="['checkbox-wrapper', { disabled }]">

      <div class="checkbox-container">
        <div v-if="disabled" :class="['checkbox', { disabled }]">
          {{ value }}
        </div>
        <input
          v-else
          :id="`checkbox__${id}__${index}`"
          :checked="value === index"
          :name="`checkbox__${id}`"
          type="checkbox"
          class="checkbox"
          @focus="toggleFocused(true)"
          @blur="toggleFocused(false)"
          @input="updateValue(index)" />
        <div class="checker">
          <IconCheckmark />
        </div>
      </div>

      <label :for="`checkbox__${id}__${index}`" class="label">
        {{ option.label }}
      </label>

    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import IconCheckmark from '@/components/icons/checkmark'

// ====================================================================== Export
export default {
  name: 'FieldCheckbox',

  components: {
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
  },

  data () {
    return {
      focused: false
    }
  },

  computed: {
    scaffold () {
      return this.field.scaffold
    },
    state () {
      return this.field.state
    },
    id () {
      return this.field.id
    },
    value () {
      return this.field.value
    },
    options () {
      return this.scaffold.options
    },
    label () {
      return this.scaffold.label
    },
    required () {
      return this.scaffold.required
    },
    disabled () {
      return this.forceDisabled || this.scaffold.disabled
    }
  },

  methods: {
    toggleFocused (focused) {
      this.focused = focused
      this.$emit('toggleFocused', focused)
    },
    updateValue (index) {
      let value = index
      if (this.value === index) { value = -1 }
      this.$emit('updateValue', value)
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
    .checkbox-wrapper,
    .checkbox,
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
  &.error {
    .checkbox + .checker {
      border-color: $flamingo;
    }
  }
}

.checkbox-wrapper {
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

.checkbox-container {
  position: relative;
}

.checkbox {
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
  z-index: 5;
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
}
</style>
