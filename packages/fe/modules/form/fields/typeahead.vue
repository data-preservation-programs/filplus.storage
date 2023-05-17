<template>
  <div
    :class="['field field-typeahead', state, {
      'dropdown-open': dropdownOpen,
      'first-option-highlighted': firstOptionHighlighted,
      'no-results': noOptionsMatchSearch,
      empty,
      disabled
    }]">

    <div v-if="disabled" :class="input">
      {{ value }}
    </div>

    <div v-else class="input-container">
      <input
        :id="fieldKey"
        :type="inputType"
        :name="fieldKey"
        :placeholder="placeholder"
        :value="value"
        :autocomplete="autocomplete"
        class="input typehead-input"
        @focus="openDropdown"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @click="openDropdown"
        @input="handleInput"
        v-on="$listeners" />
    </div>

    <Select
      ref="dropdown"
      :field="selectField"
      :options="filteredOptions"
      :aria-labelledby="ariaLabelledBy"
      :handle-click-outside="false"
      :maintain-index-state="false"
      @dropdownToggled="dropdownToggled"
      @updateValue="optionSelected"
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

  data () {
    const id = this.$uuid.v4()
    return {
      dropdownOpen: false,
      highlightedOption: -1,
      indexedOptions: [], // hardcode the unfiltered index order
      selectField: {
        value: [],
        scaffold: {
          type: 'select',
          fieldKey: id,
          isSingleOption: true
        }
      }
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
    inputType () {
      return this.scaffold.inputType
    },
    placeholder () {
      return this.scaffold.placeholder
    },
    autocomplete () {
      return this.scaffold.autocomplete
    },
    disabled () {
      return this.forceDisabled || this.scaffold.disabled
    },
    value () {
      return this.field.value
    },
    optionDisplayKey () {
      return this.scaffold.optionDisplayKey
    },
    optionReturnKey () {
      return this.scaffold.optionReturnKey
    },
    ariaLabelledBy () {
      return this.modelKey || this.fieldKey
    },
    options () {
      return this.scaffold.options
    },
    state () {
      return this.field.state
    },
    valueMatchRegExp () {
      return new RegExp(`(${this.value})`, 'ig')
    },
    empty () {
      const value = this.value
      return value === undefined || value === ''
    },
    filteredOptions () {
      const options = this.indexedOptions
      const len = options.length
      const compiled = []
      for (let i = 0; i < len; i++) {
        const option = options[i]
        const value = option[this.optionDisplayKey]
        if (value.toLowerCase().includes(this.value.toLowerCase())) {
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
    value (value) {
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
    dropdownToggled (status) {
      const dropdown = this.$refs.dropdown
      if (this.dropdown._uid !== dropdown._uid) {
        this.dropdown = dropdown
      }
      this.dropdownOpen = status
    },
    openDropdown () {
      this.dropdown.openDropdown()
      this.emitToggleFocused(true)
    },
    closeDropdown (e) {
      this.dropdown.closeDropdown()
      this.emitToggleFocused(false)
    },
    handleBlur (e) {
      const relatedTarget = e.relatedTarget
      if (!relatedTarget) { this.closeDropdown(); return }
      const classList = Array.from(relatedTarget.classList)
      if (classList.includes('select-container')) { return }
      this.closeDropdown()
    },
    emitToggleFocused (focused) {
      this.$emit('toggleFocused', focused)
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
    optionSelected (options) {
      if (options.length !== 0) {
        this.$emit('updateValue', this.options[options[0]][this.optionReturnKey])
      }
    },
    highlightText (option) {
      const value = this.value
      const optionValue = option[this.optionDisplayKey]
      if (value === '') { return optionValue }
      return optionValue.replace(this.valueMatchRegExp, '<span class="highlight">$1</span>')
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.field-typeahead {
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
