<template>
  <div class="accordion">

    <slot :active="active" />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Accordion',

  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    toggleOnLoad: {
      type: Boolean,
      required: false,
      default: false
    },
    toggleWhenAdded: {
      type: Boolean,
      required: false,
      default: false
    },
    scrollToWhenAdded: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      active: this.multiple ? [] : false,
      children: [],
      keydown: false
    }
  },

  computed: {
    toggleState () {
      return {
        open: this.active.length,
        total: this.children.length
      }
    }
  },

  created () {
    this.$on('toggle', (id) => {
      if (this.multiple) {
        // Open multiple panels
        if (this.active.includes(id)) {
          this.active = this.active.filter(_id => _id !== id)
        } else {
          this.active.push(id)
        }
        this.$emit('toggleStateChanged', this.toggleState)
      } else {
        // Open single panel
        if (this.active === id) {
          this.active = false
        } else {
          this.active = id
        }
      }
    })
    this.$on('expand-all', this.expandAll)
  },

  mounted () {
    this.keydown = this.handleKeyboardNavigation
    window.addEventListener('keydown', this.keydown)
  },

  beforeDestroy () {
    if (this.keydown) { window.removeEventListener('keydown', this.keydown) }
  },

  methods: {
    compileChildren (id) {
      this.children.push(id)
    },
    setSelected (id) {
      if (this.multiple) {
        this.active.push(id)
      } else {
        this.active = id
      }
    },
    expandAll (forceOpen) {
      if (this.multiple) {
        const active = this.active
        const children = this.children
        if (active.length === children.length && !forceOpen) {
          this.active = []
        } else {
          this.children.forEach((id) => {
            if (!active.includes(id)) {
              this.active.push(id)
            }
          })
        }
        this.$emit('toggleStateChanged', this.toggleState)
      }
    },
    handleKeyboardNavigation (e) {
      if (e.repeat) { return }
      const meta = e.metaKey || e.ctrlKey
      const f = e.keyCode === 70 || e.code === 70 || e.key === 'f'
      if (meta && f) {
        this.expandAll(true)
      }
    }
  }
}
</script>
