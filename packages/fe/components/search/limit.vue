<template>
  <Filterer
    v-slot="{ applyFilter, originalSelected }"
    filter-key="perPage"
    :is-single-option="true"
    :options="options"
    v-on="$listeners">
    <FieldContainer
      field-key="viewing_per_page"
      :scaffold="{
        type: 'select',
        required: false,
        label: 'Viewing',
        options,
        defaultValue: originalSelected.length > 0 ? originalSelected : [0], /* manually set to 0 because default in store corresponds with the 0'th value in options prop */
        resetGroupId: 'per-page',
        updateGroupId: 'per-page',
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
  name: 'Limit',

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
      await this.$applyMultipleFiltersToQuery({ filters: ['page', 'perPage'] })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.field-select) {
  width: toRem(66);
}
</style>
