<template>
  <Filterer
    v-slot="{ applyFilter, originalSelected }"
    filter-key="state"
    :is-single-selection="true"
    :default-selection="-1"
    :options="options"
    v-on="$listeners">
    <FieldContainer
      field-key="state"
      :scaffold="{
        type: 'checkbox',
        required: false,
        options: options,
        defaultValue: originalSelected,
        updateGroupId: 'state',
        isSingleSelection: true
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
  name: 'CheckboxFullyStored',

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
      await this.$applyMultipleFiltersToQuery({ filters: ['page', 'state', 'view'] })
    }
  }
}
</script>
