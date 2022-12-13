<template>
  <div :class="['field field-input', state, { focused, empty, predictive }]">

    <div v-if="disabled" :class="['input', { disabled }]">
      {{ value }}
    </div>

    <div v-else class="input-container">
      <input
        :id="fieldKey"
        v-click-outside="closeDropdown"
        :type="inputType"
        :name="fieldKey"
        :placeholder="placeholder"
        :value="value"
        :min="min"
        :max="max"
        :autocomplete="autocomplete"
        :class="['input', state]"
        @focus="focusHandler"
        @blur="focused = false"
        @input="$emit('updateValue', $event.target.value)" />
      <div v-if="typeof chars === 'number'" class="char-validation">
        {{ chars }}
      </div>
    </div>

    <div
      v-if="predictive && predictiveOptions"
      :class="['dropdown', { open: dropdownOpen }]">
      <div v-if="predictiveFiltered" class="options-container">
        <button
          v-for="(option, index) in predictiveFiltered"
          :key="index"
          :class="['option', { selected: selected(option) }]"
          @click="selectOption(option)">
          {{ option[predictiveDisplayKey] }}
        </button>
      </div>
      <div v-else class="none-found-placeholder">
        No items found
      </div>
    </div>

  </div>
</template>

<script>
// =================================================================== Functions
const preValidate = (instance, value, pre) => {
  if (typeof pre !== 'string') { return }
  const regex = new RegExp(pre)
  if (regex.test(value)) { // value contains restricted characters
    const stripped = value.replace(regex, '')
    instance.$emit('updateValue', stripped)
  }
}

// ====================================================================== Export
export default {
  name: 'FieldInput',

  props: {
    field: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      focused: false,
      dropdownOpen: false
    }
  },

  computed: {
    inputType () {
      return this.field.input_type || 'text'
    },
    fieldKey () {
      return this.field.field_key
    },
    label () {
      return this.field.label
    },
    placeholder () {
      return this.field.placeholder || 'Enter a value...'
    },
    autocomplete () {
      return this.field.autocomplete
    },
    required () {
      return this.field.required
    },
    disabled () {
      return this.field.disabled
    },
    pre () {
      return this.field.pre
    },
    chars () {
      return this.field.chars
    },
    validationMessage () {
      return this.field.validation_message
    },
    value () {
      return this.field.value
    },
    originalValue () {
      return this.field.originalValue
    },
    min () {
      return this.field.min
    },
    max () {
      return this.field.max
    },
    empty () {
      const value = this.value
      return !value || value === ''
    },
    state () {
      return this.field.state
    },
    predictive () {
      return this.field.predictive
    },
    predictiveOptions () {
      return this.field.predictive_options
    },
    predictiveDisplayKey () {
      return this.field.predictive_options.display_key
    },
    predictiveOptionsList () {
      return this.field.predictive_options.options
    },
    predictiveFiltered () {
      const filterValue = this.value.toLowerCase()
      const key = this.predictiveDisplayKey
      const filtered = this.predictiveOptionsList.filter((obj) => {
        const value = obj[key] ? obj[key].toLowerCase() : ''
        if (value.includes(filterValue)) { return obj }
        return false
      })
      if (filtered.length === 0) { return false }
      return filtered
    }
  },

  watch: {
    value (value) {
      preValidate(this, value, this.pre)
    }
  },

  methods: {
    focusHandler () {
      this.focused = true
      this.openDropdown()
    },
    openDropdown () {
      this.dropdownOpen = true
    },
    closeDropdown () {
      this.dropdownOpen = false
    },
    selected (option) {
      return option[this.predictiveDisplayKey] === this.value
    },
    selectOption (option) {
      this.$emit('updateValue', option[this.predictiveDisplayKey])
      this.closeDropdown()
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 4rem;

// ///////////////////////////////////////////////////////////////////// General
.field-input {
  height: $height;
  &.focused.predictive {
    .input {
      border-bottom-color: transparent;
    }
  }
}

.input-container,
.input {
  height: 100%;
}

.input {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-bottom: 2px solid $titanWhite;
  appearance: none;
  -moz-appearance: textfield;
  transition: 150ms ease-in-out;
  @include placeholder {
    color: rgba($aquaSqueeze, 0.7);
    font-size: toRem(18);
    font-weight: 400;
    font-style: italic;
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }
  &.caution {
    border-color: $mandysPink;
  }
  &.error {
    border-color: $flamingo;
  }
  &.disabled {
    cursor: no-drop;
    border-bottom-color: rgba(246, 245, 255, 0.25);
  }
}

// ///////////////////////////////////////////////////////// Predictive Dropdown
.dropdown {
  position: absolute;
  top: calc(100% - 2px);
  left: 0;
  width: 100%;
  max-height: $height * 5.5;
  background-color: $aztec;
  border: 2px solid $titanWhite;
  border-radius: 0.3125rem;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  overflow: hidden;
  z-index: -1;
  &.open {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
    overflow-y: scroll;
    z-index: 100;
  }
}

.options-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  z-index: 5;
}

.option {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: $height;
  padding: 0 0.875rem;
  color: inherit;
  &:hover,
  &.selected {
    background-color: rgba(white, 0.1);
  }
  &:hover {
    text-decoration: underline;
  }
}

.none-found-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: $height * 2;
  padding: 2rem;
}
</style>
