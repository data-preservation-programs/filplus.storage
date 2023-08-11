<template>
  <Field
    v-slot="{ field, fieldId, state, required, disabled, validationMessage, updateValue, toggleState }"
    v-bind="$props"
    :class="['field-container', { focused }]">

    <label v-if="scaffold.label" :for="fieldId" :class="['field-label', state]">
      <div class="panel-left">
        <IconFieldInProgress class="icon in-progress" />
        <IconFieldComplete class="icon completed" />
        <IconFieldError class="icon error" />
        <span class="text">
          {{ scaffold.label }}
          <sup v-if="required" class="required">*</sup>
        </span>
      </div>
      <div v-if="tooltip" class="tooltip" :data-tooltip="tooltip">
        <IconQuestionMark class="icon question-mark" />
      </div>
    </label>

    <div v-if="scaffold.description" class="description">
      {{ scaffold.description }}
    </div>

    <component
      :is="type"
      v-if="field.scaffold.type !== 'array'"
      :field="field"
      :form-scaffold="formScaffold"
      :disabled="disabled"
      @updateValue="updateValue"
      @toggleFocused="handleFocus($event, toggleState)"
      v-on="$listeners" />

    <Array
      v-else
      v-slot="{ groups, addGroup, removeGroup }"
      :field="field"
      :form-scaffold="formScaffold"
      :disabled="disabled">

      <div
        v-for="(group, groupIndex) in groups"
        :key="group.id"
        class="group">

        <FieldContainer
          v-for="(fieldScaffold, index) in group.scaffolds"
          :key="`${group.id}|${index}`"
          :scaffold="fieldScaffold" />

        <ButtonX
          class="trash-button"
          @clicked="removeGroup(groupIndex)">
          <IconTrash class="icon-trash" />
        </ButtonX>

      </div>

      <ButtonA
        class="add-group-button"
        @clicked="addGroup()">
        Add
      </ButtonA>

    </Array>

    <slot />

    <div v-if="validationMessage" class="validation-message">
      {{ validationMessage }}
    </div>

  </Field>
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
import FieldWysiwyg from '@/components/form/fields/wysiwyg'
import FieldTypeahead from '@/components/form/fields/typeahead'
import FieldChiclet from '@/components/form/fields/chiclet'
import ButtonA from '@/components/buttons/button-a'
import ButtonX from '@/components/buttons/button-x'

import Array from '@/modules/form/components/array'

import IconQuestionMark from '@/components/icons/question-mark'
import IconTrash from '@/components/icons/trash'
import IconFieldInProgress from '@/components/icons/form/in-progress'
import IconFieldComplete from '@/components/icons/form/complete'
import IconFieldError from '@/components/icons/form/error'

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
    FieldSelect,
    FieldWysiwyg,
    FieldTypeahead,
    FieldChiclet,
    Array,
    ButtonA,
    ButtonX,
    IconQuestionMark,
    IconTrash,
    IconFieldInProgress,
    IconFieldComplete,
    IconFieldError
  },

  props: {
    scaffold: {
      type: Object,
      required: true
    },
    /**
     * Used in the Array field
     */
    formScaffold: {
      type: Object,
      required: false,
      default: () => {}
    },
    forceDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    forceValidate: {
      type: Boolean,
      required: false,
      default: true
    },
    deregisterOnDestroy: {
      type: Boolean,
      required: false,
      default: true
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
    type () {
      const type = this.scaffold.type
      let component = false
      switch (type) {
        case 'input' : component = 'FieldInput'; break
        case 'textarea' : component = 'FieldTextarea'; break
        case 'range' : component = 'FieldRange'; break
        case 'checkbox' : component = 'FieldCheckbox'; break
        case 'radio' : component = 'FieldRadio'; break
        case 'select' : component = 'FieldSelect'; break
        case 'typeahead' : component = 'FieldTypeahead'; break
        case 'chiclet' : component = 'FieldChiclet'; break
        case 'wysiwyg' : component = 'FieldWysiwyg'; break
      }
      return component
    },
    tooltip () {
      const tooltip = this.scaffold.tooltip
      return tooltip && tooltip !== '' ? tooltip : null
    }
  },

  methods: {
    handleFocus (focused, toggleState) {
      this.focused = focused
      toggleState(focused)
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

  }
}

:deep(.field) {
  position: relative;
  font-weight: 500;
}

:deep(.description) {
  margin-top: 0.5rem;
  line-height: leading(30, 18);
  margin-bottom: 2.25rem;
}

// ////////////////////////////////////////////////////////////////////// Arrays
.array {
  display: flex;
  flex-direction: column;
}

.group {
  display: flex;
  flex-direction: row;
  .field {
    flex: 1;
      margin-bottom: 2rem;
    &:not(:last-child) {
      margin-right: 2rem;
    }
  }
}

.add-group-button {
  margin-left: auto;
}

.icon-trash {
  width: 1.5rem;
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
      border-bottom-color: $blueRibbon;
    }
    &:after {
      white-space: break-spaces;
      padding: toRem(15) toRem(20);
      top: 50%;
      left: calc(100% + 1rem);
      width: 26rem;
      font-size: 1rem;
      line-height: leading(24, 16);
      border-radius: 1rem;
      transform: translate(0.5rem, -50%);
      background-color: $blueRibbon;
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
  margin-bottom: toRem(18);
  font-size: toRem(18);
  line-height: 1;
  cursor: pointer;
  .text {
    font-weight: 500;
    transform-origin: left;
    transition: 150ms ease-out;
  }
  .required {
    color: #FF0000;
    font-size: toRem(20);
    top: 0;
  }
  &.in-progress {
    .icon.in-progress {
      display: block;
    }
  }
  &.completed {
    .icon.completed {
      display: block;
    }
  }
  &.error {
    .icon.error {
      display: block;
    }
  }
}

.panel-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.icon {
  display: none;
  margin-right: toRem(11);
  &.question-mark {
    display: block;
  }
}

// ////////////////////////////////////////////////////////////////// Validation
:deep(.validation-message) {
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
