<template>
  <div :class="['field field-wysiwyg', state]">

    <Wysiwyg
      :id="fieldKey"
      :field="field"
      @updateContentValue="updateContentValue">

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
  height: 4rem;
}

.wysiwyg-container {
  height: 100%;
  select {
    background: transparent;
  }
}
</style>
