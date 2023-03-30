<template>
  <Filterer
    v-slot="{ applyFilter, originalSelected }"
    filter-key="sort"
    :is-single-selection="true"
    :default-selection="0"
    :options="options"
    v-on="$listeners">
    <FieldContainer
      field-key="sort"
      :scaffold="{
        type: 'select',
        required: false,
        label: 'Sort by',
        options,
        defaultValue: originalSelected,
        updateGroupId: 'sort',
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
  name: 'Sort',

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
      await this.$applyMultipleFiltersToQuery({ filters: ['page', 'sort', 'view'] })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.datasets-sort {
  margin-right: toRem(30);
  @include medium {
    margin-right: 0;
  }
  :deep(.field-label) {
    white-space: nowrap;
  }
  :deep(.field-select) {
    width: toRem(140);
  }
}
</style>
