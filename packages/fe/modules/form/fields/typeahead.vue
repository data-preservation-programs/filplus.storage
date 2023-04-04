<template>
  <div
    :class="[
      'typeahead-container', {
        focused,
        'dropdown-open': dropdownOpen,
        'first-option-highlighted': firstOptionHighlighted,
        'no-results': noOptionsMatchSearch,
        empty
      }]">

    <div v-if="inputDisabled" :class="['input', { disabled: inputDisabled }]">
      {{ inputValue }}
    </div>

    <div v-else class="input-container">
      <input
        :id="inputId"
        v-click-outside="closeDropdown"
        :type="inputType"
        :name="inputId"
        :placeholder="inputPlaceholder"
        :value="inputValue"
        :autocomplete="inputAutocomplete"
        class="input typehead-input"
        @focus="openDropdown"
        @blur="closeDropdown"
        @keydown="handleKeydown"
        @click="openDropdown"
        @input="handleInput"
        v-on="$listeners" />
    </div>

    <Select
      ref="dropdown"
      :options="filteredOptions"
      :aria-labelledby="ariaLabelledBy"
      :handle-click-outside="false"
      :maintain-index-state="false"
      @dropdownToggled="dropdownToggled"
      @optionSelected="optionSelected"
      @optionHighlighted="optionHighlighted">

      <template #option-native-default-text>
        <slot name="option-native-default-text" />
      </template>

      <template #option-native-text="{ option }">
        {{ option[optionDisplayKey] }}
      </template>

      <template #option-custom="{ option, highlighted, selected }">
        <slot
          name="option-custom"
          :option="option"
          :highlighted="highlighted"
          :selected="selected"
          :highlight-text="highlightText" />
      </template>
    </Select>

  </div>
</template>

<script>
/**
 * Here's an example of a typeahead data structure
 *
 * "country": {
 *   "type": "typeahead",
 *   "inputType": "text",
 *   "modelKey": "country",
 *   "label": "Country",
 *   "placeholder": "Country",
 *   "description": "Where are you located?",
 *   "required": true,
 *   "autocomplete": "off",
 *   "pre": "[^\\u0000-\\u00ff]",
 *   "validationMessage": {
 *     "required": "This field is required"
 *   },
 *   "optionDisplayKey": "name",
 *   "optionReturnKey": "code",
 *   "options": [{"name":"Afghanistan","code":"AF"},{"name":"Åland Islands","code":"AX"}]
 * }
 *
 * Note the optionDisplayKey and optionReturnKey.
 * You can pass in any data structure (array of objects) as options and then use
 * optionDisplayKey to define which key in that data structure to match your
 * input text to. Then when an item in the dropdown is clicked, it uses the
 * optionReturnKey to to return the value you want. So for a dataset structure like this:
 *
 * {
 *  "name": "Foo", ← "optionDisplayKey": "name"
 *  "slug": "bar" ← "optionReturnKey": "slug"
 * }
 */

// ===================================================================== Imports
import Select from '@/modules/form/fields/select'

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
  name: 'FormFieldTypeahead',

  components: {
    Select
  },

  props: {
    inputType: {
      type: String,
      required: false,
      default: 'text'
    },
    inputPlaceholder: {
      type: String,
      required: false,
      default: 'Enter a value...'
    },
    inputAutocomplete: {
      type: String,
      required: false,
      default: 'off'
    },
    inputDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    inputId: {
      type: String,
      required: true
    },
    inputValue: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    optionDisplayKey: {
      type: String,
      required: true
    },
    optionReturnKey: {
      type: String,
      required: true
    },
    ariaLabelledBy: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      focused: false,
      dropdownOpen: false,
      highlightedOption: -1,
      indexedOptions: [] // hardcode the unfiltered index order
    }
  },

  computed: {
    valueMatchRegExp () {
      return new RegExp(`(${this.inputValue})`, 'ig')
    },
    empty () {
      const value = this.inputValue
      return value === undefined || value === ''
    },
    filteredOptions () {
      const options = this.indexedOptions
      const len = options.length
      const compiled = []
      for (let i = 0; i < len; i++) {
        const option = options[i]
        const value = option[this.optionDisplayKey]
        if (value.toLowerCase().includes(this.inputValue.toLowerCase())) {
          compiled.push(option)
        }
      }
      return compiled
    },
    noOptionsMatchSearch () {
      return this.filteredOptions.length === 0
    },
    firstOptionHighlighted () {
      return this.highlightedOption === 0
    }
  },

  watch: {
    inputValue (value) {
      preValidate(this, value, this.pre)
    }
  },

  created () {
    const options = this.options.slice()
    const len = options.length
    for (let i = 0; i < len; i++) {
      options[i].index = i
    }
    this.indexedOptions = options
  },

  mounted () {
    this.dropdown = this.$refs.dropdown
  },

  methods: {
    dropdownToggled (state) {
      const dropdown = this.$refs.dropdown
      if (this.dropdown._uid !== dropdown._uid) {
        this.dropdown = dropdown
      }
      this.dropdownOpen = state
    },
    openDropdown () {
      this.dropdown.openDropdown()
      this.emitToggleFocused(true)
    },
    closeDropdown () {
      this.dropdown.closeDropdown()
      this.emitToggleFocused(false)
    },
    emitToggleFocused (status) {
      this.focused = status
      this.$emit('toggleFocused', status)
    },
    handleInput (e) {
      if (!this.dropdownOpen) {
        this.openDropdown()
      }
      this.$emit('updateValue', e.target.value)
    },
    handleKeydown (e) {
      this.dropdown.handleKeyboardNavigation(e)
    },
    optionHighlighted (index) {
      this.highlightedOption = index
    },
    optionSelected (index) {
      if (index !== -1) {
        this.$emit('optionSelected', this.options[index][this.optionReturnKey])
        this.$emit('updateValue', this.options[index][this.optionReturnKey])
      }
    },
    highlightText (option) {
      const inputValue = this.inputValue
      const optionValue = option[this.optionDisplayKey]
      if (inputValue === '') { return optionValue }
      return optionValue.replace(this.valueMatchRegExp, '<span class="highlight">$1</span>')
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.typeahead-container {
  &.dropdown-open {
    @media (hover: hover) {
      &.no-results {
        :deep(div.select-container) {
          display: none;
        }
      }
    }
  }
}

.input-container {
  position: relative;
}

.input-container,
.input {
  width: 100%;
  height: 100%;
}

// //////////////////////////////////////////////////////////////////// Dropdown
:deep(div.select-container) {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 5;
}

:deep(div.select-container) {
  @media (hover: hover) {
    &.dropdown-open {
      display: block;
      select.select {
        &.native {
          display: none;
        }
      }
    }
  }
}

:deep(div.dropdown) {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
}

:deep(div.selection-window-wrapper) {
  display: none;
}

:deep(div.selection-window) {
  width: 100%;
  height: 100%;
}
</style>
