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
    // for options with boolean or single-select value
    // ie. checkboxes or select
    isSingleOption: {
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

  async created () {
    if (!this.filter) {
      await this.$filter(this.filterKey).register(
        this.filterKey,
        this.options,
        this.defaultSelection,
        this.isSingleOption,
        this.action
      )
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
        live: payload.live
      })
      let value
      if (this.action === 'query') {
        value = this.$filter(id).convert('query', this.filter.selected, this.filter.options)
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
  },

  render () {
    return this.$scopedSlots.default({
      applyFilter: this.applyFilter,
      originalSelected: this.originalSelected,
      selected: this.selected,
      isSelected: this.isSelected,
      clearFilters: this.clearFilters,
      empty: this.empty
    })
  }
}
</script>
