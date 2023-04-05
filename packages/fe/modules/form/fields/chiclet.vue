<template>
  <div :class="['field field-chiclet', state, { empty, disabled }]">

    <div v-if="disabled" class="input">
      {{ value }}
    </div>

    <div v-else class="input-container">
      <input
        :id="fieldKey"
        v-model="inputValue"
        type="text"
        :name="fieldKey"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :autocomplete="autocomplete"
        class="input"
        @focus="toggleFocused(true)"
        @blur="toggleFocused(false)"
        @keydown="handleKeyboardNavigation" />
    </div>

    <div class="toolbar">
      <slot
        name="chiclets"
        :chiclets-exist="!disabled && chiclets.length > 0"
        :chiclets="chiclets"
        :remove-chiclet="removeChiclet"
        :disabled="disabled"
        :clear-all-chiclets="clearAllChiclets" />
    </div>

  </div>
</template>

<script>
// =================================================================== Functions
const preValidate = (value, pre) => {
  if (typeof pre !== 'string') { return value }
  const regex = new RegExp(pre)
  // check if value contains restricted characters and parse them out
  return regex.test(value) ? value.replace(regex, '') : value
}

// ====================================================================== Export
export default {
  name: 'FormFieldChiclet',

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
      inputValue: ''
    }
  },

  computed: {
    scaffold () {
      return this.field.scaffold
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
    chiclets () {
      return this.field.value
    },
    min () {
      return this.scaffold.min
    },
    max () {
      return this.scaffold.max
    },
    empty () {
      const value = this.inputValue
      return value === undefined || value === null || value === '' || !this.disabled
    },
    state () {
      return this.field.state
    }
  },

  methods: {
    clearAllChiclets () {
      this.$emit('updateValue', [])
    },
    removeChiclet (incoming) {
      const chiclets = this.chiclets.slice()
      const index = chiclets.findIndex(chiclet => chiclet === incoming)
      chiclets.splice(index, 1)
      this.$emit('updateValue', chiclets)
    },
    handleKeyboardNavigation (e) {
      const keyCode = e.keyCode
      const code = e.keyCode
      const key = e.key
      const enter = keyCode === 13 || code === 13 || key === 'Enter'
      if (enter) {
        this.submitChiclets()
      }
    },
    submitChiclets () {
      const chiclets = this.chiclets
      const inputValue = this.inputValue.split(',')
      if (inputValue === '') { return }
      const compiled = []
      inputValue.forEach((input) => {
        const processed = preValidate(input.trim(), this.pre)
        if (processed !== '' && !chiclets.includes(processed)) {
          compiled.push(processed)
        }
      })
      this.$emit('updateValue', chiclets.concat(compiled))
      this.inputValue = ''
    },
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
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }
}
</style>
