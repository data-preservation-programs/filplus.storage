<template>
  <div
    v-click-outside="closeDropdown"
    :class="['dropdown', { focused, open }]">

    <div
      ref="windowWrapper"
      :style="{ width: dropdownWidth }"
      class="window-wrapper"
      @click="toggleDropdown(!open)">
      <slot name="window" :dropdown-open="open" />
    </div>

    <div
      ref="optionsWrapper"
      :style="{ height: optionsHeight }"
      class="options-wrapper">
      <slot name="options" />
    </div>

    <div
      :style="{ height: dropdownHeight }"
      :class="['dropdown-backdrop', { visible: loaded }]" />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Dropdown',

  data () {
    return {
      focused: false,
      open: false,
      loaded: false,
      dropdownWidth: undefined,
      dropdownHeight: '100%',
      optionsHeight: '0px'
    }
  },

  watch: {
    '$route' () {
      this.closeDropdown()
    }
  },

  mounted () {
    this.$nextTick(() => {
      const windowWrapper = this.$refs.windowWrapper.firstElementChild
      const windowWidth = windowWrapper.offsetWidth
      const optionsWrapper = this.$refs.optionsWrapper.firstElementChild
      const optionsWidth = optionsWrapper.offsetWidth
      if (optionsWidth > windowWidth) {
        this.dropdownWidth = `${optionsWidth}px`
      }
      this.dropdownHeight = `${this.$refs.windowWrapper.firstElementChild.clientHeight}px`
      this.loaded = true
    })
  },

  methods: {
    toggleDropdown (open) {
      this.applyDimensions(open)
      this.open = open
    },
    closeDropdown () {
      this.toggleDropdown(false)
    },
    applyDimensions (open) {
      const windowWrapper = this.$refs.windowWrapper.firstElementChild
      const optionsWrapper = this.$refs.optionsWrapper.firstElementChild
      const windowHeight = windowWrapper.offsetHeight
      const optionsHeight = open ? optionsWrapper.offsetHeight : 0
      this.optionsHeight = `${optionsHeight}px`
      this.dropdownHeight = `${open ? windowHeight + optionsHeight : windowHeight}px`
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.dropdown {
  position: relative;
  z-index: 10000;
  &.open {
    .dropdown-wrapper {
      transition: 150ms ease-in;
      border-radius: toRem(18);
    }
    .options-wrapper {
      transition: 140ms ease-in;
    }
  }
}

.dropdown-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: hidden;
  z-index: -1;
  transition: 150ms ease-out;
  &.visible {
    visibility: visible;
  }
}

.options-wrapper {
  position: absolute;
  top: 100%;
  overflow: hidden;
  transition: 150ms ease-out;
}
</style>
