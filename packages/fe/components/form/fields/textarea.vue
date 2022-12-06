<template>
  <div :class="['field field-textarea', state, { focused, empty }]">

    <div v-if="disabled" :class="['textarea', { disabled }]">
      {{ value }}
    </div>

    <div v-else class="textarea-container">
      <textarea
        :value="value"
        :placeholder="placeholder"
        :class="['textarea', state]"
        @focus="focused = true"
        @blur="focused = false"
        @input="$emit('updateValue', $event.target.value)"></textarea>
      <div v-if="typeof chars === 'number'" class="char-validation">
        {{ chars }}
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
  name: 'FieldTextarea',

  props: {
    field: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      focused: false
    }
  },

  computed: {
    name () {
      return this.field.name
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
.field-textarea {
  height: 10rem;
  transition: 150ms ease-out;
  &.focused {
    .textarea {
      border-color: $titanWhite;
    }
  }
  &:not(.empty) {
    
  }
}

.textarea-container,
.textarea {
  height: 100%;
}

.textarea {
  width: 100%;
  padding: 1.5rem;
  border: 2px solid $nandor;
  border-radius: 0.625rem;
  transition: 150ms ease-in-out;
  @include placeholder {
    color: rgba($aquaSqueeze, 0.7);
    font-size: toRem(18);
    font-weight: 400;
    font-style: italic;
  }
  &.caution {
    border-color: $mandysPink;
  }
  &.error {
    border-color: $flamingo;
  }
  &.disabled {
    cursor: no-drop;
    border-bottom-color: rgba(227, 211, 192, 0.25);
    overflow-y: scroll;
  }
}
</style>
