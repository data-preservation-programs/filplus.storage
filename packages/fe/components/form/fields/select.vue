<template>
  <div :class="['field field-select', state, { empty, 'dropdown-open': dropdownOpen }]">

    <Select
      :options="options"
      :aria-labelledby="modelKey || fieldKey"
      :selected-option="value"
      @dropdownToggled="dropdownToggled"
      @optionSelected="optionSelected"
      v-on="$listeners">

      <template #option-native-text="{ option }">
        {{ getOptionDescription(option) ? `${option.label}, ${getOptionDescription(option)}` : option.label }}
      </template>

      <template #selection-window="{ selected }">
        <div class="selection-window">
          <div v-if="!empty" class="text">
            {{ getSelectedOptionLabel(selected) }}
          </div>
          <div class="icon-container">
            <IconChevron />
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

import IconChevron from '@/components/icons/chevron'

// ====================================================================== Export
export default {
  name: 'FieldSelect',

  components: {
    Select,
    IconChevron
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
    scaffold () {
      return this.field.scaffold
    },
    modelKey () {
      return this.scaffold.modelKey
    },
    fieldKey () {
      return this.field.fieldKey
    },
    label () {
      return this.scaffold.label
    },
    options () {
      return this.scaffold.options
    },
    value () {
      return this.field.value
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
      this.$emit('toggleFocused', state)
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
  &.dropdown-open {
    .select {
      border-bottom-color: transparent;
    }
    .dropdown {
      transform-origin: top center;
      scale: 1 1;
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
    transform-origin: top center;
    scale: 1 0;
    transition: scale 150ms ease-out;
    max-height: $height * 5.5;
    background-color: $aztec;
    border: 2px solid $titanWhite;
    border-radius: 0.3125rem;
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
  .icon-chevron {
    width: 0.6875rem;
  }
}

.option {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: 150ms ease-out;
  &:hover,
  &.highlighted,
  &.selected {
    background-color: rgba(white, 0.1);
  }
  &:hover,
  &.highlighted {
    text-decoration: underline;
  }
}
</style>
