<template>
  <div :class="['field field-wysiwyg', state]">

    <Wysiwyg
      :id="fieldKey"
      :field="field"
      @updateContentValue="updateContentValue">

      <template #format-tool-label="{ formatTool }">
        <span v-if="formatTool.label" v-html="formatTool.label" />
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
// ///////////////////////////////////////////////////////////////////// General
.field-wysiwyg {
  border: 2px solid $nandor;
  border-radius: toRem(10);
}

:deep(.wysiwyg-toolbar) {
  border-bottom: 2px solid $nandor;
  .wysiwyg-formatting-button {
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
