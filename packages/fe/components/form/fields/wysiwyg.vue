<template>
  <div :class="['field field-wysiwyg', state]">

    <Wysiwyg
      :id="fieldKey"
      :field="field"
      @updateEditorValue="updateEditorValue">

      <template #format-tool-label="{ formatTool }">
        <span v-html="formatTool.label ? formatTool.label : formatTool.name" />
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
      editor: null
    }
  },

  computed: {
    value () {
      return this.field.value
    },
    required () {
      return this.field.required
    },
    fieldKey () {
      return this.field.fieldKey
    },
    state () {
      return this.field.state
    }
  },

  methods: {
    updateEditorValue (value) {
      this.editor = value
      this.$emit('updateValue', value)
    }
  }
}
</script>

<style lang="scss" scoped>

// ///////////////////////////////////////////////////////////////////// General
.field-wysiwyg {
  height: 4rem;
}

.wysiwyg-container {
  height: 100%;
  select {
    background: transparent;
  }
}

</style>
