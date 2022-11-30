<template>
  <div :class="['field field-range', state, { focused }]">

    <label v-if="label" :for="name" class="label floating">
      <span class="text">{{ label }}</span>
      <sup v-if="required" class="required">*</sup>
    </label>

    <Range
      :field="field"
      v-on="$listeners">

      <template #thumb>
        <div class="thumb" />
      </template>

      <template #progress-bar>
        <div :class="['progress-bar', `progress-${value}`]" />
      </template>

    </Range>

  </div>
</template>

<script>
// ===================================================================== Imports
import Range from '@/modules/form/components/range'

// ====================================================================== Export
export default {
  name: 'FieldRange',

  components: {
    Range
  },

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
    inputType () {
      return this.field.input_type || 'text'
    },
    name () {
      return this.field.name
    },
    label () {
      return this.field.label
    },
    placeholder () {
      return this.field.placeholder || 'Enter a value...'
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
    }
  }
}
</script>

<style lang="scss" scoped>
$thumbWidth: 1.5rem;
$borderWidth: 2px;

::v-deep .range-track {
  height: 0.75rem;
  border: 2px solid tomato;
  border-radius: 0.5rem;
  &:hover {
    .thumb {
      &:before {
        width: 100%;
        transform: translateX(0);
      }
    }
  }
}

.thumb {
  width: $thumbWidth;
  height: 1.5rem;
  border: $borderWidth solid transparent;
  border-radius: 0.25rem;
  &:before {
    content: '';
    position: absolute;
    top: -$borderWidth;
    left: -$borderWidth;
    width: 0px;
    height: 100%;
    border-width: inherit;
    border-style: solid;
    border-color: tomato;
    border-radius: inherit;
    pointer-events: inherit;
    background-color: tomato;
    transform: translateX(calc(#{math.div($thumbWidth, 2)} - #{$borderWidth}));
    transition: 150ms linear;
  }
}

// ///////////////////////////////////////////////////////////////////// General
.progress-bar {
  height: 100%;
  border-radius: 0.5rem;
  background-color: tomato;
  &.progress-100 {
    width: 100% !important;
  }
}
</style>
