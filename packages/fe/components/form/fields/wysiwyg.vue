<template>
  <div :class="['field field-wysiwyg', state]">

    <Wysiwyg
      :id="fieldKey"
      :field="field"
      :toolbar-config="toolbarConfig"
      @updateEditorValue="updateEditorValue">

      <template #toolbar-option-name="{ toolbarOption }">
        <span v-html="toolbarOption.label ? toolbarOption.label : toolbarOption.name" />
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
      editor: null,
      defaultToolbarConfig: [
        {
          name: 'heading-select',
          type: 'select',
          include: true
        },
        {
          name: 'bold',
          label: '<b>B</b>',
          type: 'button-x',
          include: true
        },
        {
          name: 'italic',
          label: '<em>I</em>',
          type: 'button-x',
          include: true
        },
        {
          name: 'underline',
          label: '<u>U</u>',
          type: 'button-x',
          include: true
        },
        {
          name: 'bulletList',
          type: 'button-x',
          include: true
        },
        {
          name: 'orderedList',
          type: 'button-x',
          include: true
        },
        {
          name: 'undo',
          type: 'button-x',
          include: true
        },
        {
          name: 'redo',
          type: 'button-x',
          include: true
        },
        {
          name: 'left',
          checkActive: { textAlign: 'left' },
          type: 'button-x',
          include: true
        },
        {
          name: 'center',
          checkActive: { textAlign: 'center' },
          type: 'button-x',
          include: true
        },
        {
          name: 'right',
          checkActive: { textAlign: 'right' },
          type: 'button-x',
          include: true
        },
        {
          name: 'justify',
          checkActive: { textAlign: 'justify' },
          type: 'button-x',
          include: true
        },
        {
          name: 'link',
          type: 'button-x',
          include: true
        }
      ]
    }
  },

  computed: {
    scaffold () {
      return this.field.scaffold
    },
    value () {
      return this.field.value
    },
    toolbarConfig () {
      if (this.field.toolbarConfig !== undefined) {
        return this.field.toolbarConfig
      }
      return this.defaultToolbarConfig
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

.wysiwyg-container{
  height: 100%;
  select {
    background: transparent;
  }
}

</style>
