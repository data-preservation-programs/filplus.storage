<template>
  <Select
    :field="field"
    :force-disabled="forceDisabled"
    :options="options"
    class="field field-select"
    v-on="$listeners">

    <template #option-native-default-text="{ placeholder, label }">
      {{ placeholder || label }}
    </template>

    <template #option-native-text="{ option }">
      {{ getOptionDescription(option) ? `${option.label}, ${getOptionDescription(option)}` : option.label }}
    </template>

    <template #selection-window="{ selected, placeholder, label, empty }">
      <div class="selection-window">
        <div class="text">
          <template v-if="!empty">
            {{ getSelectedOptionLabels(selected) }}
          </template>
          <template v-else>
            {{ placeholder || label }}
          </template>
        </div>
        <div class="icon-container">
          <IconChevron />
        </div>
      </div>
    </template>

    <template #option-custom="{ option, highlighted, selected }">
      <div :class="['option', { highlighted, selected }]">
        <div class="label">
          <template v-if="multi && selected">
            <IconCheckmark />
          </template>
          {{ option.label }}
        </div>
        <div v-if="getOptionDescription(option)" class="description">
          {{ getOptionDescription(option) }}
        </div>
      </div>
    </template>

  </Select>
</template>

<script>
// ===================================================================== Imports
import Select from '@/modules/form/fields/select'

import IconChevron from '@/components/icons/chevron'
import IconCheckmark from '@/components/icons/checkmark'

// ====================================================================== Export
export default {
  name: 'FieldSelect',

  components: {
    Select,
    IconChevron,
    IconCheckmark
  },

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

  computed: {
    scaffold () {
      return this.field.scaffold
    },
    options () {
      return this.scaffold.options
    },
    multi () {
      return !this.scaffold.isSingleOption
    },
    isSingleSelection () {
      return this.scaffold.isSingleSelection
    }
  },

  methods: {
    getOptionDescription (option) {
      if (option && option.description !== '') { return option.description }
      return false
    },
    getSelectedOptionLabels (selection) {
      const isSingleSelection = this.isSingleSelection
      if (isSingleSelection) {
        if (selection === -1) { return this.placeholder }
        const option = this.options[selection]
        if (option) {
          return option.label
        }
      } else {
        if (selection.length === 0) { return this.placeholder }
        const selections = selection.map((index) => {
          return this.options[index].label
        })
        return selections.join(', ')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 3.125rem;

// ///////////////////////////////////////////////////////////////////// General
div.field-select {
  height: $height;
  padding: 0 toRem(12);
  border: 2px solid $mineralGreen;
  border-radius: toRem(5);
  transition: border-color 150ms ease-out;
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
    :deep(div.dropdown) {
      transform-origin: top center;
      scale: 1 1;
    }
  }
  &.in-progress {
    transition: border-color 150ms ease-in;
    border-color: $mandysPink;
  }
  &.error {
    transition: border-color 150ms ease-in;
    border-color: $flamingo;
  }
}

:deep(select.select) {
  transition: 150ms ease-out;
  &.native {
    &:focus-visible {
      @include focusBoxShadow;
    }
  }
}

:deep(div.dropdown) {
  transform-origin: top center;
  scale: 1 0;
  transition: scale 150ms ease-out;
  max-height: $height * 5.5;
  width: calc(100% + 4px);
  left: -2px;
  background-color: $aztec;
  border: 2px solid $mineralGreen;
  border-radius: 0.3125rem;
}

.selection-window {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 toRem(12);
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
}

.label {
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 10;
  :deep(svg.icon-checkmark) {
    width: toRem(12);
    margin-right: 0.5rem;
    path {
      stroke: $titanWhite;
    }
  }
}
</style>
