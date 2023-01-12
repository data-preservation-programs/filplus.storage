<template>
  <div class="field field-wysiwyg">

    <div class="wysiwyg-container">

      <client-only>
        <editor-content
          :id="fieldKey"
          :editor="editor"
          :type="inputType"
          :name="fieldKey"
          :value="value"
          :class="['wysiwyg', state]" />
      </client-only>

    </div>

  </div>

</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'

export default {
  name: 'FieldWysiwyg',

  components: {
    EditorContent
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
    inputType () {
      return this.field.inputType || 'text'
    },
    fieldKey () {
      return this.field.fieldKey
    },
    value () {
      return this.field.value
    },
    state () {
      return this.field.state
    }
  },

  mounted () {
    this.editor = new Editor({
      content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
      extensions: [
        StarterKit
      ],
      onUpdate ({ editor }) {
        console.log('editor onUpdate ', editor.getText()) // outputs
      }
    })
    // console.log('mounted editor', this.editor)
  },

  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>

<style lang='scss' scoped>

// ///////////////////////////////////////////////////////////////////// General
.field-wysiwyg {
  height: 4rem;
}

.wysiwyg-container{
  height: 100%;
}

</style>
