<template>
  <component
    :is="tag">

    <slot :update-props="updateProps" />

  </component>

</template>

<script>
export default {
  name: 'AutoUpdate',

  props: {
    tag: {
      type: String,
      required: false,
      default: 'div'
    },
    updateProps: {
      type: Object,
      required: true
    },
    refresh: {
      type: [Number, Boolean],
      required: false,
      default: false
    }
  },

  created () {
    if (this.refresh) {
      setInterval(this.autoupdate, this.refresh)
    }
  },

  methods: {
    updateComponent () {
      this.$emit('nextUpdate')
    }
  }
}
</script>
