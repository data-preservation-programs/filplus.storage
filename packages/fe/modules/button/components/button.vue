<template>
  <component
    :is="tag"
    :to="tag === 'nuxt-link' ? to : false"
    :href="tag === 'a' ? to : false"
    :disabled="disabled || loading"
    :target="target"
    :class="['button', { selected }]"
    @click="clickHandler($event)">

    <slot :loading="loading" />

  </component>
</template>

<script>
// ===================================================================== Imports
// import { mapGetters, mapActions } from 'vuex'

// ====================================================================== Export
export default {
  name: 'Button',

  props: {
    tag: { // button, 'a' or nuxt-link
      type: String,
      required: false,
      default: 'button'
    },
    to: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    target: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    loader: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    selected: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    const self = this
    return {
      id: self.loader || self.$uuid.v4()
    }
  },

  computed: {
    button () {
      return this.$button(this.id).get()
    },
    loading () {
      return this.button && this.button.loading
    }
  },

  async created () {
    if (!this.field) {
      await this.$button(this.id).register()
    }
  },

  methods: {
    clickHandler (e) {
      e.stopPropagation()
      if (!this.disabled) {
        const loader = this.loader
        if (typeof loader === 'string') {
          this.$button(this.id).set({ loading: true })
        }
        this.$emit('clicked', e)
      }
    }
  }
}
</script>
