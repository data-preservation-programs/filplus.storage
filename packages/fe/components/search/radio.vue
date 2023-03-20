<template>
  <Filterer
    v-slot="{ applyFilter, originalSelected }"
    filter-key="view"
    :is-single-option="true"
    :options="options"
    v-on="$listeners">
    <FieldContainer
      field-key="view"
      :scaffold="{
        type: 'radio',
        required: false,
        label: 'Show',
        options,
        defaultValue: originalSelected.length > 0 ? originalSelected : [1], /* manually set to corresponding n'th value in options prop */
        isSingleOption: true
      }"
      @updateValue="initializeFilter($event, applyFilter)" />
  </Filterer>
</template>

<script>
// ===================================================================== Imports
import Filterer from '@/modules/search/components/filterer'
import FieldContainer from '@/components/form/field-container'

// ====================================================================== Export
export default {
  name: 'Radio',

  components: {
    Filterer,
    FieldContainer
  },

  props: {
    options: {
      type: Array,
      required: true
    }
  },

  methods: {
    async initializeFilter (index, applyFilter) {
      await applyFilter({ index, live: false })
      await this.$filter('page').for({ index: 0, live: false })
      await this.$applyMultipleFiltersToQuery({ filters: ['page', 'view'] })
    }
  }
}
</script>
