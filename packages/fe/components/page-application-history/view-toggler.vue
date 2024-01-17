<template>
  <Filterer
    v-slot="{ applyFilter, originalSelected }"
    filter-key="view"
    :is-single-selection="true"
    :default-selection="1"
    :options="options"
    v-on="$listeners">

    <div class="field-text">
      Show
    </div>

    <Field
      v-slot="{ updateValue, field }"
      field-key="view"
      :scaffold="{
        type: 'radio',
        required: false,
        label: 'Show',
        id: 'view-toggler',
        options,
        defaultValue: originalSelected,
        updateGroupId: 'view',
        isSingleSelection: true
      }"
      class="field-container"
      v-on="$listeners">

      <Radio
        :field="field"
        @updateValue="initializeFilter($event, updateValue, applyFilter)">

        <template #radio-extra>
          <div class="checker">
            <div class="dot" />
          </div>
        </template>

        <template #label="{ id, label }">
          <div class="label">
            <label :for="id">
              {{ label }}
            </label>
            <div v-if="showIdentifier(label)" class="count" />
          </div>
        </template>

      </Radio>

    </Field>

  </Filterer>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Filterer from '@/modules/search/components/filterer'
import Field from '@/modules/form/components/field'
import Radio from '@/modules/form/fields/radio'

// ====================================================================== Export
export default {
  name: 'ViewToggler',

  components: {
    Filterer,
    Field,
    Radio
  },

  props: {
    options: {
      type: Array,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      view: 'account/view',
      openCount: 'account/openCount'
    })
  },

  methods: {
    async initializeFilter (index, updateValue, applyFilter) {
      updateValue(index)
      await applyFilter({ index, live: false })
      await this.$filter('page').for({ index: 0, live: false })
      await this.$applyMultipleFiltersToQuery({ filters: ['page', 'view'] })
    },
    showIdentifier (label) {
      const show = this.openCount[
        label
          .replace(' (legacy)', '')
          .toLowerCase()
          .replace('ldn', 'lda')
      ]
      if (show) { return true }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
$dimension: 1.625rem;

@keyframes shrink-bounce {
  0% { transform: scale(1); }
  33% { transform: scale(0.85); }
  100% { transform: scale(1); }
}

// ///////////////////////////////////////////////////////////////////// General
.field-text {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 1.125rem;
  font-size: 1rem;
  font-weight: 500;
}

.count {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: calc(100% - toRem(8));
  left: 100%;
  width: toRem(9);
  height: toRem(9);
  font-size: toRem(7);
  font-weight: 700;
  background-color: $dodgerBlue;
  border-radius: 50%;
  pointer-events: none;
}

.field-radio {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}

:deep(.radio-wrapper) {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  &:hover {
    .checker {
      transition: 150ms ease-in;
      transform: scale(1.1);
    }
  }
  &:not(:last-child) {
    margin-right: 2.125rem;
  }
}

:deep(.radio-container) {
  position: relative;
}

:deep(.radio) {
  display: flex;
  position: relative;
  width: $dimension;
  height: $dimension;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
  &:checked {
    + .checker {
      animation: shrink-bounce 150ms cubic-bezier(0.4, 0, 0.23, 1);
      border-color: $nandor;
      background-color: $racingGreen;
      .dot {
        display: block;
      }
    }
  }
  &:focus-visible {
    + .checker {
      @include focusBoxShadow;
    }
  }
}

.checker {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: $dimension;
  height: $dimension;
  border: 2px solid $nandor;
  border-radius: 50%;
  background-color: $racingGreen;
  pointer-events: none;
  z-index: 5;
  transition: border-color 150ms, background-color 150ms, transform 150ms ease-out;
}

.dot {
  display: none;
  clip-path: circle(50%);
  background: radial-gradient(50% 50% at 50% 50%, transparent 0%, $greenYellow 100%);
  height: toRem(12);
  width: toRem(12);
}

.label {
  font-weight: 400;
  padding-left: 1rem;
  line-height: leading(26, 18);
  cursor: pointer;
  label {
    cursor: pointer;
  }
}
</style>
