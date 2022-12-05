<template>
  <div :class="['field field-select', state, { empty, 'dropdown-open': dropdownOpen }]">

    <Select
      :options="options"
      :aria-labelledby="modelKey"
      :selected-option="value"
      handle-state="internally"
      @dropdownToggled="dropdownToggled"
      @optionSelected="optionSelected">

      <template #option-native-text="{ option }">
        {{ getOptionDescription(option) ? `${option.label}, ${getOptionDescription(option)}` : option.label }}
      </template>

      <template #selection-window="{ selected }">
        <div class="selection-window">
          <div v-if="!empty" class="text">
            {{ getSelectedOptionLabel(selected) }}
          </div>
          <div class="icon-container">
            <IconChevronDown />
          </div>
        </div>
      </template>

      <template #option-custom="{ option, highlighted, selected }">
        <div :class="['option', { highlighted, selected }]">
          <div class="label">
            {{ option.label }}
          </div>
          <div v-if="getOptionDescription(option)" class="description">
            {{ getOptionDescription(option) }}
          </div>
        </div>
      </template>

    </Select>

  </div>
</template>

<script>
// ===================================================================== Imports
import Select from '@/modules/form/components/select'

import IconChevronDown from '@/components/icons/chevron-down'

// ====================================================================== Export
export default {
  name: 'FieldSelect',

  components: {
    Select,
    IconChevronDown
  },

  props: {
    field: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      dropdownOpen: false,
      selectedOption: false
    }
  },

  computed: {
    modelKey () {
      return this.field.model_key
    },
    label () {
      return this.field.label
    },
    options () {
      return this.field.options
    },
    value () {
      const field = this.field
      let value = this.field.value || this.field.default_value
      if (typeof field.value === 'string') {
        const index = this.options.findIndex(option => option.label === field.value)
        value = index
      }
      return value
    },
    required () {
      return this.field.required
    },
    state () {
      return this.field.state
    },
    empty () {
      return this.selectedOption === -1
    }
  },

  methods: {
    getOptionDescription (option) {
      if (option && option.description !== '') { return option.description }
      return false
    },
    getSelectedOptionLabel (selection) {
      if (selection === -1) { return this.label }
      return this.options[selection].label
    },
    dropdownToggled (state) {
      this.dropdownOpen = state
    },
    optionSelected (value) {
      this.selectedOption = value
      this.$emit('updateValue', value)
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 4rem;

// ///////////////////////////////////////////////////////////////////// General
.field-select {
  height: $height;
  &:hover {
    .icon-container {
      transition: 150ms ease-in;
      transform: scale(1.2);
    }
  }
  &.dropdown-open {
    &.empty > .label {
      padding-left: 0.75rem;
    }
    .icon-container {
      transition: 150ms ease-in;
      transform: rotate(-180deg);
    }
  }
  &.caution {
    ::v-deep .select {
      border-color: $mandysPink;
    }
  }
  &.error {
    ::v-deep .select {
      border-color: $flamingo;
    }
  }
}

::v-deep .select-container {
  &:not(.focused) {
    .select.native {
      color: transparent;
    }
  }
  .select {
    border-bottom: 2px solid $titanWhite;
    transition: 150ms ease-out;
    &.native {
      &:focus-visible {
        @include focusBoxShadow;
      }
    }
  }
  .dropdown {
    max-height: $height * 5.5;
    background-color: blue;
  }
}

.label {
  z-index: 10;
}

.selection-window {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  transition: 150ms ease-out;
  .text {
    flex: 1;
    padding-right: 0.25rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .icon-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-left: auto;
    transition: 150ms ease-out;
  }
  .icon-chevron-down {
    width: 0.625rem;
  }
}

.option {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: 150ms ease-out;
  &:hover,
  &.highlighted {
    transition: 150ms ease-in;
    background-color: teal;
  }
  &.selected {
    .label {
      text-decoration: underline;
    }
  }
  .description {
    margin-top: -0.25rem;
    font-size: 0.875rem;
    font-weight: 400;
    opacity: 0.4;
  }
}
</style>
