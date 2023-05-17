<!-- https://css-tricks.com/striking-a-balance-between-native-and-custom-select-elements/ -->

<template>
  <div
    tabindex="-1"
    :class="['select-container', state, {
      'select-container-focused': selectContainerFocused,
      'select-native-focused': selectNativeFocused,
      'dropdown-open': dropdownOpen
    }]"
    @focus="handleFocusBlur('focus', 'select-container')"
    @blur="handleFocusBlur('blur', 'select-container')"
    @keydown="handleKeyboardNavigation($event)">

    <!-- =================================================== [Select] Native -->
    <select
      ref="selectNative"
      :aria-labelledby="ariaLabelledby"
      :multiple="!isSingleOption"
      class="select native"
      tabindex="0"
      @focus="handleFocusBlur('focus', 'select-native')"
      @blur="handleFocusBlur('blur', 'select-native')"
      @change="selectOption('native', $event)">
      <option disabled="disabled" :selected="empty" value="-1">
        <slot
          name="option-native-default-text"
          :placeholder="placeholder"
          :label="label" />
      </option>
      <option
        v-for="(option, index) in options"
        :key="`native-${index}`"
        :value="option.index || index"
        :selected="isCurrentlySelected(option.index || index)">
        <slot name="option-native-text" :option="option" />
      </option>
    </select>

    <!-- =================================================== [Select] Custom -->
    <div
      :aria-hidden="dropdownOpen ? 'false' : 'true'"
      class="select custom">

      <div
        class="selection-window-wrapper"
        @click="toggleDropdown">
        <slot
          name="selection-window"
          :selected="selectedOptions"
          :placeholder="placeholder"
          :label="label"
          :empty="empty" />
      </div>

      <div
        ref="dropdown"
        class="dropdown">
        <div
          v-for="(option, index) in options"
          :key="`custom-${index}`"
          :ref="`option-${ariaLabelledby}-${option.index || index}`"
          class="option-wrapper"
          @mouseenter="toggleOptionHighlighted('enter', option.index || index)"
          @mouseleave="toggleOptionHighlighted('leave')"
          @click="selectOption('custom', option.index || index)">
          <slot
            name="option-custom"
            :option="option"
            :index="option.index || index"
            :highlighted="isCurrentlyHighlighted(option.index || index)"
            :selected="isCurrentlySelected(option.index || index)" />
        </div>
      </div>

    </div>

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'FormFieldSelect',

  props: {
    field: {
      type: Object,
      required: true
    },
    /**
     * Options need to be passed in explicitly since the options coming in from
     * the Typeahead are pre-processed
     */
    options: {
      type: Array,
      required: true
    },
    /**
     * Define whether or not to maintain selection based on index. In the case of
     * the typeahead field for example, there is no need to maintain a record of
     * which index is selected since the value is recorded by the typeahead. This
     * Select simply acts as a fresh value selector in that case.
     */
    maintainIndexState: {
      type: Boolean,
      required: false,
      default: true
    },
    /**
     * Define whether or not to handle v-click-outside in this component. Example:
     * the typeahead field handles this instead.
     */
    handleClickOutside: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data () {
    return {
      selectContainerFocused: false,
      selectNativeFocused: false,
      dropdownOpen: false,
      autoScrollDropdown: false,
      currentOptionsHighlighted: []
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
    ariaLabelledby () {
      return this.modelKey || this.fieldKey
    },
    label () {
      return this.scaffold.label
    },
    placeholder () {
      return this.scaffold.placeholder
    },
    isSingleOption () {
      return this.scaffold.isSingleOption || false
    },
    selectedOptions () {
      const value = this.field.value
      return typeof value === 'string' ? [] : value // typeahead values are strings
    },
    required () {
      return this.field.required
    },
    state () {
      return this.field.state
    },
    empty () {
      return this.selectedOptions.length === 0
    }
  },

  watch: {
    dropdownOpen (state) {
      this.$emit('dropdownToggled', state)
    },
    currentOptionsHighlighted (index) {
      this.$emit('optionHighlighted', index)
      const container = this.$refs.dropdown
      let option = this.$refs[`option-${this.ariaLabelledby}-${index}`]
      if (option) {
        option = option[0]
        if (this.autoScrollDropdown) {
          container.scrollTop = option.offsetTop
          this.autoScrollDropdown = false
        }
      }
    },
    empty (status) {
      this.$emit('toggleEmpty', status)
    }
  },

  created () {
    this.currentOptionsHighlighted = this.selectedOptions
  },

  beforeDestroy () {
    this.$emit('dropdownToggled', false)
  },

  methods: {
    toggleDropdown () {
      this.dropdownOpen ? this.closeDropdown() : this.openDropdown()
    },
    openDropdown () {
      this.currentOptionsHighlighted = this.selectedOptions
      this.dropdownOpen = true
    },
    closeDropdown () {
      this.currentOptionsHighlighted = []
      this.dropdownOpen = false
    },
    handleFocusBlur (type, element) {
      const focused = type === 'focus'
      this[element === 'select-container' ? 'selectContainerFocused' : 'selectNativeFocused'] = focused
      this.$emit('toggleFocused', focused)
      if (this.handleClickOutside && type === 'blur') {
        this.closeDropdown()
      }
    },
    toggleOptionHighlighted (action, index) {
      if (this.isSingleOption) {
        this.currentOptionsHighlighted = action === 'leave' ? [] : [index]
      }
    },
    isCurrentlyHighlighted (index) {
      return this.currentOptionsHighlighted.includes(index)
    },
    isCurrentlySelected (index) {
      return this.selectedOptions.includes(index)
    },
    selectOption (type, incoming) {
      const isSingleOption = this.isSingleOption
      const selectedIndex = parseInt(typeof incoming === 'number' ? incoming : incoming.target.value)
      let selected = isSingleOption ? [selectedIndex] : this.selectedOptions.slice()
      if (isSingleOption) {
        this.closeDropdown()
      } else {
        if (type === 'custom') {
          const found = selected.findIndex(index => index === selectedIndex)
          found === -1 ? selected.push(selectedIndex) : selected.splice(found, 1)
        } else if (type === 'native') {
          selected = Array.from(incoming.target.selectedOptions).map(option => (parseInt(option.value)))
        }
      }
      this.currentOptionsHighlighted = selected
      this.$emit('updateValue', selected)
    },
    handleKeyboardNavigation (e) {
      const classList = Array.from(e.srcElement.classList)
      if (!classList.includes('select-container') && !classList.includes('typehead-input')) { return }
      this.autoScrollDropdown = true
      const keyCode = e.keyCode
      const code = e.keyCode
      const key = e.key
      const esc = keyCode === 27 || code === 'Escape' || key === 'Escape'
      const down = keyCode === 40 || code === 40 || key === 'ArrowDown'
      const up = keyCode === 38 || code === 38 || key === 'ArrowUp'
      const submit = keyCode === 13 || code === 13 || key === 'Enter'
      if (!esc && !down && !up && !submit) { return }
      if (esc) { this.closeDropdown(); return }
      const isSingleOption = this.isSingleOption
      const currentHighlighted = this.currentOptionsHighlighted
      let selection = currentHighlighted
      if (isSingleOption) {
        selection = selection[0]
        if (selection === 0) {
          selection = 0
        } else if (selection === undefined) {
          selection = -1
        }
      }
      if (!this.selectContainerFocused && this.dropdownOpen) { e.preventDefault() }
      const options = this.options
      const len = options.length
      if (!this.maintainIndexState) {
        let prev = selection === -1 ? options[len - 1].index : options[0].index
        let next = selection === -1 ? options[0].index : options[len - 1].index
        for (let i = 0; i < len; i++) {
          if (options[i].index === selection) {
            const prevOption = options[i - 1]
            const nextOption = options[i + 1]
            if (prevOption) { prev = prevOption.index }
            if (nextOption) { next = nextOption.index }
          }
        }
        if (up && prev !== undefined) {
          selection = prev
        } else if (down && next !== undefined) {
          selection = next
        }
      } else {
        if (isSingleOption) {
          if (up && selection === -1) {
            selection = len - 1
          } else if (up && selection > 0) {
            selection--
          } else if (down && selection < len - 1) {
            selection++
          }
        } else {
          // TODO: implement keyboard navigation for multi-select
        }
      }
      this.currentOptionsHighlighted = isSingleOption ? [selection] : selection
      if (submit) {
        this.selectOption('custom', selection)
        this.closeDropdown()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.select-container {
  position: relative;
  width: 100%;
  height: 100%;
  &:after {
    content: '▾';
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    line-height: 1;
  }
  &.dropdown-open {
    .dropdown {
      display: block;
    }
  }
}

.select {
  width: 100%;
  height: 100%;
  &.native {
    appearance: none;
    background-color: transparent;
    border: 0;
    &:focus-visible {
      outline: none;
    }
  }
  &.custom {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    z-index: 5;
  }
}

@media (hover: hover) {
  .select-container {
    &:after {
      display: none;
    }
    &.select-native-focused {
      &:after {
        content: 'press ↓ key';
        display: flex;
        font-size: toRem(14);
      }
    }
  }
  .select {
    &.native {
      opacity: 0;
      &:focus {
        opacity: 1;
        + .custom {
          display: none;
        }
      }
    }
    &.custom {
      display: block;
    }
  }
}

.selection-window-wrapper {
  width: 100%;
  height: 100%;
}

.dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 10rem;
  overflow-y: scroll;
  background-color: black;
}
</style>
