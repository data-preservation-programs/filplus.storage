<template>
  <div :class="['field field-checkbox', state, { disabled }]">

    <div
      v-for="(option, index) in options"
      :key="index"
      class="checkbox-wrapper">

      <div class="checkbox-container">
        <div v-if="disabled" class="checkbox" />
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
        <slot name="checkbox-extra" />
      </div>

      <slot
        :id="`checkbox__${id}__${index}`"
        name="label"
        :label="option.label" />

    </div>

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'FormFieldCheckbox',

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
    },
    updateValue (index) {
      let value = index
      if (this.value === index) { value = -1 }
      this.$emit('updateValue', value)
    }
  }
}
</script>
