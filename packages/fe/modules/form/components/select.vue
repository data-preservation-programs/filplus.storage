<!-- https://css-tricks.com/striking-a-balance-between-native-and-custom-select-elements/ -->

<template>
  <div
    tabindex="-1"
    :class="['select-container', { focused, 'dropdown-open': dropdownOpen }]"
    @blur="toggleFocused(false)"
    @keydown="handleKeyboardNavigation($event)">

    <!-- =================================================== [Select] Native -->
    <select
      ref="selectNative"
      :aria-labelledby="ariaLabelledby"
      class="select native"
      tabindex="0"
      @focus="toggleFocused(true)"
      @blur="toggleFocused(false)"
      @change="selectOption($event.target.value)">
      <option disabled="disabled" :selected="selectedOption === -1" value="-1">
        <slot name="option-native-default-text" />
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
      v-click-outside="clickOutside"
      :aria-hidden="dropdownOpen ? 'false' : 'true'"
      class="select custom"
      @click="toggleDropdown">

      <div class="selection-window-wrapper">
        <slot
          name="selection-window"
          :selected="selectedOption" />
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
          @click="selectOption(option.index || index)">
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
  name: 'Select',

  props: {
    options: {
      type: Array,
      required: true
    },
    ariaLabelledby: {
      type: String,
      required: true
    },
    selectedOption: {
      type: [Number, String],
      required: false,
      default: -1
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
    const selectedOption = this.selectedOption
    return {
      focused: false,
      dropdownOpen: false,
      autoScrollDropdown: false,
      currentOptionHighlighted: selectedOption
    }
  },

  watch: {
    dropdownOpen (state) {
      this.$emit('dropdownToggled', state)
    },
    currentOptionHighlighted (index) {
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
    }
  },

  beforeDestroy () {
    this.$emit('dropdownToggled', false)
  },

  methods: {
    toggleFocused (focused) {
      focused ? this.openDropdown() : this.closeDropdown()
      this.focused = focused
      this.$emit('toggleFocused', focused)
    },
    toggleDropdown () {
      this.currentOptionHighlighted = this.dropdownOpen ? -1 : this.selectedOption
      this.dropdownOpen = !this.dropdownOpen
    },
    openDropdown () {
      if (!this.dropdownOpen) {
        this.currentOptionHighlighted = this.selectedOption
        this.dropdownOpen = true
      }
    },
    closeDropdown () {
      if (this.dropdownOpen) {
        this.currentOptionHighlighted = -1
        this.dropdownOpen = false
      }
    },
    clickOutside () {
      if (this.handleClickOutside) {
        this.closeDropdown()
      }
    },
    toggleOptionHighlighted (action, index) {
      this.currentOptionHighlighted = action === 'leave' ? -1 : index
    },
    isCurrentlyHighlighted (index) {
      return this.currentOptionHighlighted === index
    },
    isCurrentlySelected (index) {
      return this.selectedOption === index
    },
    selectOption (index) {
      const value = parseInt(index)
      this.$refs.selectNative.value = value
      this.$emit('optionSelected', value)
    },
    handleKeyboardNavigation (e) {
      const classList = Array.from(e.srcElement.classList)
      if (!classList.includes('select-container') && !classList.includes('typehead-input')) { return }
      if (!this.dropdownOpen) {
        this.openDropdown()
      }
      this.autoScrollDropdown = true
      let selection = this.currentOptionHighlighted
      const keyCode = e.keyCode
      const code = e.keyCode
      const key = e.key
      const down = keyCode === 40 || code === 40 || key === 'ArrowDown'
      const up = keyCode === 38 || code === 38 || key === 'ArrowUp'
      const submit = keyCode === 13 || code === 13 || key === 'Enter'
      if (!down && !up && !submit) { return }
      if (!this.focused && this.dropdownOpen) { e.preventDefault() }
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
        if (up && selection > 0) {
          selection--
        } else if (down && selection < len - 1) {
          selection++
        }
      }
      this.currentOptionHighlighted = selection
      if (submit) {
        this.selectOption(selection)
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
  &:focus {
    border: 2px solid green !important;
  }
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
    &:focus {
      border: 2px solid blue !important;
    }
  }
  &.custom {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    z-index: 5;
    &:focus {
      border: 2px solid red !important;
    }
  }
}

@media (hover: hover) {
  .select-container {
    &:after {
      display: none;
    }
    &.focused {
      &:after {
        display: flex;
      }
    }
  }
  .select {
    &.native {
      &:focus {
        display: block;
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
