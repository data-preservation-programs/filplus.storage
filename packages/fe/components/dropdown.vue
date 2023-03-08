<template>
  <div :class="['dropdown', { focused, 'dropdown-open': dropdownOpen }]">

    <div class="window">
      <slot name="window" />
    </div>

    <div class="options">
      <slot name="options" />
    </div>

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Dropdown',

  data () {
    return {
      focused: false,
      dropdownOpen: false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.options {
  position: absolute;
  top: 100%;
}
</style>
