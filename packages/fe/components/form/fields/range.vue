<template>
  <div :class="['field field-range', state, { focused }]">

    <label v-if="label" :for="name" class="label floating">
      <span class="text">{{ label }}</span>
      <sup v-if="required" class="required">*</sup>
    </label>

    <!-- {{ value }} | {{ $formatBytes(value) }} $replace -->

    <Range
      :field="field"
      v-on="$listeners">

      <template #thumb>
        <div class="thumb" />
      </template>

      <template #progress-bar>
        <div class="progress-bar" />
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
$trackHeight: 1.875rem;
$thumbWidth: 4px;
$borderWidth: 2px;

// /////////////////////////////////////////////////////////////////////// Track
::v-deep .range-track {
  position: relative;
  left: calc(#{math.div(-$trackHeight, 2)} + #{math.div($thumbWidth, 2)});
  height: $trackHeight;
  width: calc(100% + #{$trackHeight} - #{math.div($thumbWidth, 1)});
  margin-bottom: $borderWidth;
  &:before {
    content: '';
    position: absolute;
    top: 100%;
    left: calc(#{math.div($trackHeight, 2)} - #{math.div($thumbWidth, 2)});
    width: calc(100% - #{$trackHeight} + #{math.div($thumbWidth, 1)});
    height: $borderWidth;
    background-color: $replace4;
  }
  &:hover {
    .thumb {
      &:before,
      &:after {
        height: $trackHeight * 1.2;
        transform: translateY(-$trackHeight * 0.2);
      }
    }
  }
}

// /////////////////////////////////////////////////////////////////////// Thumb
.thumb {
  position: relative;
  left: calc(#{math.div($trackHeight, 2)} - #{math.div($thumbWidth, 2)});
  width: $thumbWidth;
  height: $trackHeight;
  background-color: $replace4;
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    height: 100%;
    width: 50%;
    pointer-events: inherit;
    background-color: inherit;
    transition: all 150ms linear;
  }
  &:before {
    content: '';
    right: 50%;
  }
  &:after {
    content: '';
    left: 50%;
  }
}

// //////////////////////////////////////////////////////////////// Progress Bar
.progress-bar {
  position: relative;
  left: calc(#{math.div($trackHeight, 2)} - #{math.div($thumbWidth, 2)});
  width: calc(100% - #{$trackHeight} + #{math.div($thumbWidth, 1)});
  height: 100%;
  background-color: $replace2;
}
</style>
