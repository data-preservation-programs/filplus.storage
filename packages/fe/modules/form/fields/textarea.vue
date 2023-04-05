<template>
  <div :class="['field field-textarea', state, { empty, disabled }]">

    <div v-if="disabled" class="textarea">
      {{ value }}
    </div>

    <div class="textarea-container">
      <textarea
        :value="value"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="textarea"
        @input="$emit('updateValue', $event.target.value)"></textarea>
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
  name: 'FormFieldTextarea',

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
    state () {
      return this.field.state
    },
    empty () {
      return this.value === ''
    }
  },

  watch: {
    value (value) {
      preValidate(this, value, this.pre)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.textarea-container,
.textarea {
  width: 100%;
  height: 100%;
}
</style>
