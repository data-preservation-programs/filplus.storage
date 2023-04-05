<template>
  <div :class="['field field-radio', state, { disabled }]">

    <div
      v-for="(option, index) in options"
      :key="index"
      class="radio-wrapper">

      <div class="radio-container">
        <div v-if="disabled" class="radio" />
        <input
          v-else
          :id="`radio__${id}__${index}`"
          :checked="value === index"
          :name="`radio-${id}`"
          type="radio"
          class="radio"
          @focus="toggleFocused(true)"
          @blur="toggleFocused(false)"
          @input="$emit('updateValue', index)" />
        <slot name="radio-extra" />
      </div>

      <slot
        :id="`radio__${id}__${index}`"
        name="label"
        :label="option.label" />

    </div>

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'FormFieldRadio',

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
    disabled () {
      return this.forceDisabled || this.scaffold.disabled
    }
  },

  methods: {
    toggleFocused (focused) {
      this.focused = focused
      this.$emit('toggleFocused', focused)
    }
  }
}
</script>
