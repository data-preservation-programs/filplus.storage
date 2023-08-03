<template>
  <div :class="['field field-input', state, { empty, disabled }]">

    <div v-if="disabled" class="input">
      {{ value }}
    </div>

    <div v-else class="input-container">
      <input
        :id="fieldKey"
        :type="inputType"
        :name="fieldKey"
        :placeholder="placeholder"
        :value="value"
        :min="min"
        :max="max"
        :autocomplete="autocomplete"
        class="input"
        @focus="toggleFocused(true)"
        @blur="toggleFocused(false)"
        @input="$emit('updateValue', $event.target.value)" />
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
  name: 'FormFieldInput',

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

  computed: {
    scaffold () {
      return this.field.scaffold
    },
    inputType () {
      return this.scaffold.inputType || 'text'
    },
    fieldKey () {
      return this.field.fieldKey
    },
    placeholder () {
      return this.scaffold.placeholder || 'Enter a value...'
    },
    autocomplete () {
      return this.scaffold.autocomplete
    },
    disabled () {
      return this.forceDisabled || this.scaffold.disabled
    },
    pre () {
      return this.scaffold.pre
    },
    value () {
      return this.field.value
    },
    min () {
      return this.scaffold.min
    },
    max () {
      return this.scaffold.max
    },
    empty () {
      const value = this.value
      return !value || value === ''
    },
    state () {
      return this.field.state
    }
  },

  watch: {
    value (value) {
      preValidate(this, value, this.pre)
    }
  },

  methods: {
    toggleFocused (focused) {
      this.$emit('toggleFocused', focused)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.input-container,
.input {
  width: 100%;
  height: 100%;
}

.input {
  appearance: none;
  -moz-appearance: textfield;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }
}
</style>
