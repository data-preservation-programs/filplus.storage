<template>
  <FieldStandalone
    v-slot="{ updateValue, field, type, validationMessage }"
    v-bind="$props"
    :class="['field-container', { disabled, focused }]"
    v-on="$listeners">

    <label v-if="scaffold.label" :for="fieldKey" class="field-label">
      <span class="text">
        {{ scaffold.label }}
      </span>
      <div v-if="tooltip" class="tooltip" :data-tooltip="tooltip">
        <IconQuestionMark />
      </div>
    </label>

    <div v-if="scaffold.description" class="description">
      {{ scaffold.description }}
    </div>

    <component
      :is="type"
      :field="field"
      :field-key="fieldKey"
      :force-disabled="forceDisabled"
      @updateValue="updateValue"
      @toggleFocused="toggleFocused"
      v-on="$listeners" />

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
import FieldWysiwyg from '@/components/form/fields/wysiwyg'
import FieldTypeahead from '@/components/form/fields/typeahead'
import FieldChiclet from '@/components/form/fields/chiclet'

import IconQuestionMark from '@/components/icons/question-mark'

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
    FieldWysiwyg,
    FieldTypeahead,
    FieldChiclet,
    IconQuestionMark
  },

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
    validateOnEntry: {
      type: Boolean,
      required: false,
      default: false
    },
    forceDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    deregisterOnDestroy: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * On occasions where the final root element in field-conditional.vue render
     * must be something specific. Such as when wrapping a <tbody> in a field-standalone,
     * it cannot be a div as the wrapper. It must be <tbody> at the root to prevent
     * SSR hydration errors.
     */
    rootHtmlTag: {
      type: String,
      required: false,
      default: 'div'
    }
  },

  data () {
    return {
      focused: false
    }
  },

  computed: {
    tooltip () {
      const tooltip = this.scaffold.tooltip
      return tooltip && tooltip !== '' ? tooltip : false
    },
    disabled () {
      return this.forceDisabled || this.scaffold.disabled
    }
  },

  methods: {
    toggleFocused (focused) {
      this.focused = focused
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes grow {
  0% { transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1); }
}

// ///////////////////////////////////////////////////////////////////// General
.field-container {
  &:hover,
  &:focus-within {
    .tooltip {
      &:before,
      &:after,
      .icon {
        transition: 150ms ease-in;
        opacity: 1;
      }
      &:before {
        transform: translate(0, -50%) rotate(-90deg);
      }
      &:after {
        transform: translate(0, -50%);
      }
      .icon {
        transform: scale(1);
      }
    }
  }
  &.disabled {
    .field-label {
      cursor: default;
    }
  }
  &.focused {
    .field-label {
      .text {
        transition: 150ms ease-in;
        color: rgba($aquaSqueeze, 0.7);
        transform: scale(0.9);
      }
    }
  }
}

::v-deep .field {
  position: relative;
  font-weight: 500;
}

::v-deep .description {
  margin-top: 0.5rem;
  line-height: leading(30, 18);
  margin-bottom: 2.25rem;
}

// ///////////////////////////////////////////////////////////////////// Tooltip
.tooltip {
  &[data-tooltip] {
    height: toRem(25);
    width: toRem(25);
    &:before {
      top: 50%;
      left: calc(100% + 4px);
      transform: translate(0.5rem, -50%) rotate(-90deg);
      border-bottom-width: 0.5rem;
      border-bottom-color: $dodgerBlue;
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
      background-color: $dodgerBlue;
    }
  }
  .icon {
    transform: scale(0);
    opacity: 0;
    transition: 100ms ease-out;
  }
}

// /////////////////////////////////////////////////////////////////////// Label
.field-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: toRem(20);
  font-weight: 500;
  cursor: pointer;
  .text {
    transform-origin: left;
    transition: 150ms ease-out;
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
