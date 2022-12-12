<template>
  <div class="field-container">
    <Field v-bind="$props">
      <div slot-scope="{ updateValue, field, type, validationMessage }" :class="['field-wrapper', field.type]">

        <label v-if="field.label" :for="field.field_key" class="field-label">
          {{ field.label }}
        </label>

        <div v-if="field.description" class="description">
          {{ field.description }}
        </div>

        <component
          :is="type"
          :field="field"
          :data-tooltip="tooltip"
          @updateValue="updateValue" />

        <slot />

        <div v-if="validationMessage" class="validation-message">
          {{ validationMessage }}
        </div>

      </div>
    </Field>
  </div>
</template>

<script>
// ===================================================================== Imports
import Field from '@/modules/form/components/field'
import FieldInput from '@/components/form/fields/input'
import FieldTextarea from '@/components/form/fields/textarea'
import FieldRange from '@/components/form/fields/range'
import FieldCheckbox from '@/components/form/fields/checkbox'
import FieldRadio from '@/components/form/fields/radio'
import FieldSelect from '@/components/form/fields/select'

// ====================================================================== Export
export default {
  name: 'FieldContainer',

  components: {
    Field,
    FieldInput,
    FieldTextarea,
    FieldRange,
    FieldCheckbox,
    FieldRadio,
    FieldSelect
  },

  props: {
    scaffold: {
      type: Object,
      required: true
    },
    value: {
      type: [Object, String, Number, Boolean],
      required: false,
      default: false
    },
    formId: {
      type: String,
      required: true
    },
    groupId: {
      type: String,
      required: false,
      default: ''
    },
    forceDisableFields: {
      type: Boolean,
      required: false,
      default: false
    },
    deregisterFormFieldOnDestroy: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    tooltip () {
      return this.scaffold.tooltip
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
