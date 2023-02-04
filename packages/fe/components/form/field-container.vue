<template>
  <FieldStandalone
    v-slot="{ updateValue, field, type, validationMessage }"
    v-bind="$props"
    class="field-container"
    v-on="$listeners">

    <label v-if="scaffold.label" :for="fieldKey" class="field-label">
      {{ scaffold.label }}
    </label>

    <div v-if="scaffold.description" class="description">
      {{ scaffold.description }}
    </div>

    <component
      :is="type"
      :field="field"
      :field-key="fieldKey"
      :data-tooltip="tooltip"
      @updateValue="pushValue($event, updateValue)" />

    <slot />

    <div v-if="validationMessage" class="validation-message">
      {{ validationMessage }}
    </div>

  </FieldStandalone>
</template>

<script>
// ===================================================================== Imports
import FieldStandalone from '@/modules/form/components/field-standalone'
import FieldInput from '@/components/form/fields/input'
import FieldTextarea from '@/components/form/fields/textarea'
import FieldRange from '@/components/form/fields/range'
import FieldCheckbox from '@/components/form/fields/checkbox'
import FieldRadio from '@/components/form/fields/radio'
import FieldSelect from '@/components/form/fields/select'
import FieldTypeahead from '@/components/form/fields/typeahead'
import FieldChiclet from '@/components/form/fields/chiclet'

// ====================================================================== Export
export default {
  name: 'FieldContainer',

  components: {
    FieldStandalone,
    FieldInput,
    FieldTextarea,
    FieldRange,
    FieldCheckbox,
    FieldRadio,
    FieldSelect,
    FieldTypeahead,
    FieldChiclet
  },

  /**
   * props:
   *
   * @updateValue - triggers when field has changed
   * :resetGroupId - if this prop matches ID passed to 'resetFormFields' global bus event, then reset the field value
   */
  props: {
    scaffold: {
      type: Object,
      required: true
    },
    formId: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    fieldKey: {
      type: String,
      required: true
    },
    groupIndex: {
      type: [Number, Boolean],
      required: false,
      default: false
    },
    forceDisableFields: {
      type: Boolean,
      required: false,
      default: false
    },
    deregisterOnDestroy: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    tooltip () {
      const tooltip = this.scaffold.tooltip
      return tooltip && tooltip !== '' ? tooltip : false
    }
  },

  methods: {
    pushValue (value, updateValue) {
      updateValue(value)
      this.$emit('updateValue', value)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
::v-deep .field {
  position: relative;
  font-weight: 500;
  &.focused,
  &:not(.empty) {
    // background-color: teal;
  }
  &:hover,
  &.focused {
    &[data-tooltip] {
      &:before {
        transform: translate(0, -50%) rotate(-90deg);
      }
      &:after {
        transform: translate(0, -50%);
      }
    }
  }
}

::v-deep .description {
  margin-top: 0.5rem;
  line-height: leading(30, 18);
  margin-bottom: 2.25rem;
}

[data-tooltip] {
  &:before {
    top: calc(50% + 0.475rem);
    left: calc(100% + 4px);
    transform: translate(0.5rem, -50%) rotate(-90deg);
    border-bottom-width: 0.5rem;
  }
  &:after {
    white-space: break-spaces;
    padding: 2rem;
    top: 50%;
    left: calc(100% + 1rem);
    width: 26rem;
    font-size: 1rem;
    line-height: leading(27, 16);
    border-radius: 1rem;
    transform: translate(0.5rem, -50%);
  }
}

// /////////////////////////////////////////////////////////////////////// Label
.field-label {
  display: block;
  font-size: toRem(20);
  font-weight: 500;
  cursor: pointer;
  a {
    color: darkorange;
    &:hover {
      text-decoration: underline;
    }
  }
}

// ////////////////////////////////////////////////////////////////// Validation
::v-deep .validation-message {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: $flamingo;
  font-style: italic;
  sup {
    top: -0.125rem;
    margin-right: 0.0625rem;
    font-size: 100%;
  }
}
</style>
