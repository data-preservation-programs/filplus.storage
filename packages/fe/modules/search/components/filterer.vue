<template>
  <div v-if="loaded" class="filter">

    <slot
      :apply-filter="applyFilter"
      :original-selected="originalSelected"
      :selected="selected"
      :is-selected="isSelected"
      :clear-filters="clearFilters"
      :empty="empty" />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Filterer',

  props: {
    action: { // 'query', 'emit', 'store'
      type: String,
      required: false,
      default: 'query'
    },
    filterKey: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    defaultSelection: {
      type: Number,
      required: true
    },
    // Depict whether or not to select only 1 item at a time (effectively a toggle)
    isSingleSelection: {
      type: Boolean,
      required: false,
      default: false
    },
    deregisterOnDestroy: {
      type: Boolean,
      required: false,
      default: false
    }
    // storeGetter: {
    //   type: String,
    //   required: false,
    //   default: 'general/filterValue'
    // },
    // storeAction: {
    //   type: String,
    //   required: false,
    //   default: 'general/setFilterValue'
    // }
  },

  data () {
    return {
      loaded: false
    }
  },

  async fetch () {
    await this.$filter(this.filterKey).register(
      this.options,
      this.defaultSelection,
      this.isSingleSelection,
      this.action
    )
    this.loaded = true
  },

  computed: {
    filter () {
      return this.$filter(this.filterKey).get()
    },
    selected () {
      const filter = this.filter
      return filter ? filter.selected : []
    },
    originalSelected () {
      const filter = this.filter
      return filter ? filter.originalSelected : []
    },
    empty () {
      return this.selected.length === 0
    }
  },

  beforeDestroy () {
    this.$filter(this.filterKey).clear()
    if (this.deregisterOnDestroy) {
      this.$filter(this.filterKey).deregister()
    }
  },

  methods: {
    async applyFilter (payload) {
      if (!payload.hasOwnProperty('live')) {
        throw new Error('Forgot to specify { live: true|false }')
      }
      const id = this.filterKey
      const live = payload.live
      await this.$filter(id).for({
        instance: this,
        index: payload.index,
        live
      })
      let value
      if (this.action === 'query') {
        value = await this.$filter(id).convert('query', this.filter.selected, this.filter.options, this.filter.isSingleOption)
      }
      this.$emit('filterApplied', {
        live,
        filter: { id, value, live }
      })
    },
    isSelected (index) {
      return this.selected.includes(index)
    },
    clearFilters () {
      this.$filter(this.filterKey).clear()
    }
  }
}
</script>
