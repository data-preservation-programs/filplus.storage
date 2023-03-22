<template>
  <div :class="['field field-wysiwyg', state]">

    <Wysiwyg
      :id="fieldKey"
      :field="field"
      @updateContentValue="updateContentValue">

      <template #format-button-label="{ formatTool }">
        <span v-html="formatTool.label" />
      </template>

      <template #format-input-label="{ formatTool }">
        <label
          :for="formatTool.name"
          v-html="formatTool.label" />
      </template>

    </Wysiwyg>

  </div>

</template>

<script>
// ===================================================================== Imports
import Wysiwyg from '@/modules/form/components/Wysiwyg'

// ====================================================================== Export
export default {
  name: 'FieldWysiwyg',

  components: {
    Wysiwyg
  },

  props: {
    field: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      content: null
    }
  },

  computed: {
    fieldKey () {
      return this.field.fieldKey
    },
    state () {
      return this.field.state
    }
  },

  methods: {
    updateContentValue (value) {
      this.content = value
      this.$emit('updateValue', value)
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin input {
    box-sizing: border-box;
    border: 1px solid $mineralGreen;
    border-radius: toRem(1);
    height: 5px;
}
// ///////////////////////////////////////////////////////////////////// General
.field-wysiwyg {
  border: 2px solid $nandor;
  border-radius: toRem(10);
}

:deep(.wysiwyg-toolbar) {
  border-bottom: 2px solid $nandor;

  .toolbar-section-mobile-wrapper {
    &:is(:first-child){
      @include medium {
        .toolbar-section:is(:last-child) {
          border-right: none;
        }
      }
    }
    &:is(:last-child) {
      .toolbar-section:is(:last-child) {
        border-right: none;
      }
      @include medium {
        border-top: 2px solid $nandor;
      }
    }
  }

  .toolbar-section {
    border-right: 2px solid $nandor;
  }

  .wysiwyg-formatting-option {
    .user-input-wrapper {
      border: 2px solid $nandor;
    }
  }

  .wysiwyg-formatting-input::-webkit-color-swatch {
    @include input;
  }
  .wysiwyg-formatting-input::-moz-color-swatch {
    @include input;
  }

  .wysiwyg-formatting-button, .input-wrapper {
    &:hover {
      background: rgba(59, 86, 79, 0.5);
    }
    &.is-active {
      background: $mineralGreen;
    }
  }
}

.wysiwyg-container {
  height: 100%;
  select {
    background: transparent;
  }
}
</style>
