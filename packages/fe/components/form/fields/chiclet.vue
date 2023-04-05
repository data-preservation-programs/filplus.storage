<template>
  <Chiclet
    :field="field"
    :force-disabled="forceDisabled"
    v-on="$listeners">

    <template #chiclets="{ chiclets, disabled, chicletsExist, removeChiclet, clearAllChiclets }">

      <ButtonB
        v-if="chicletsExist"
        format="mini"
        class="clear-all-button button"
        @clicked="clearAllChiclets">
        <IconClose />
        <span>Clear All</span>
      </ButtonB>

      <ButtonB
        v-for="chiclet in chiclets"
        :key="chiclet"
        :disabled="disabled"
        format="mini"
        class="chiclet button"
        @clicked="removeChiclet(chiclet)">
        <IconClose />
        <span>{{ chiclet }}</span>
      </ButtonB>

    </template>

  </Chiclet>
</template>

<script>
// ===================================================================== Imports
import Chiclet from '@/modules/form/fields/chiclet'
import ButtonB from '@/components/buttons/button-b'

import IconClose from '@/components/icons/close-thick'

// ====================================================================== Export
export default {
  name: 'FieldChiclet',

  components: {
    Chiclet,
    ButtonB,
    IconClose
  },

  props: {
    field: {
      type: Object,
      required: true
    },
    forceDisabled: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 2.5rem;

// ///////////////////////////////////////////////////////////////////// General
.field-chiclet {
  height: $height;
  &.caution {
    :deep(.input) {
      border-color: $mandysPink;
    }
  }
  &.error {
    :deep(.input) {
      border-color: $flamingo;
    }
  }
  &.disabled {
    cursor: no-drop;
    :deep(.input) {
      border-bottom: 0;
      margin-bottom: -1rem;
      border-bottom-color: rgba(246, 245, 255, 0.25);
    }
  }
}

:deep(.input) {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 2px solid $titanWhite;
  appearance: none;
  transition: 150ms ease-in-out;
  @include placeholder {
    opacity: 0;
  }
}

// //////////////////////////////////////////////////////////////////// Chiclets
:deep(.toolbar) {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 1rem;
}

:deep(.button) {
  &:not([disabled]) {
    &:hover {
      transition: 150ms ease-in;
      color: $aztec;
      .svg-icon path {
        transition: 150ms ease-in;
        fill: $aztec;
      }
    }
  }
}

.clear-all-button {
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
}

:deep(.chiclet) {
  margin-bottom: 0.5rem;
  &:not(:last-child) {
    margin-right: 0.5rem;
  }
}

:deep(.button) {
  .svg-icon {
    width: 8px;
    margin-right: 0.25rem;
    path {
      transition: 150ms ease-out;
      fill: $greenYellow;
    }
  }
}
</style>
