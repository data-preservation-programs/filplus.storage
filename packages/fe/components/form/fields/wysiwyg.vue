<template>
  <div class="field field-wysiwyg">

    <div v-if="editor" class="wysiwyg-container">
      <div class="wysiwyg-formatting-container">
        <Select
          class="wysiwig-heading-dropdown"
          :field="headingSelectField"
          @updateValue="updateHeadingSelectNode" />
        <ButtonX
          :class="[ 'wysiwyg-formatting-button', { 'is-active': editor.isActive('bold') }]"
          @clicked="editor.chain().focus().toggleBold().run()">
          <strong>B</strong>
        </ButtonX>
        <ButtonX
          :class="[ 'wysiwyg-formatting-button', { 'is-active': editor.isActive('italic') }]"
          @clicked="editor.chain().focus().toggleItalic().run()">
          <em>I</em>
        </ButtonX>
        <ButtonX
          :class="[ 'wysiwyg-formatting-button', { 'is-active': editor.isActive('underline') }]"
          @clicked="editor.chain().focus().toggleUnderline().run()">
          <u>U</u>
        </ButtonX>
        <ButtonX
          :class="[ 'wysiwyg-formatting-button', { 'is-active': editor.isActive('bulletList') }]"
          @clicked="editor.chain().focus().toggleBulletList().run()">
          bullet list
        </ButtonX>
        <ButtonX
          :class="[ 'wysiwyg-formatting-button', { 'is-active': editor.isActive('orderedList') }]"
          @clicked="editor.chain().focus().toggleOrderedList().run()">
          ordered list
        </ButtonX>
        <ButtonX
          class="wysiwyg-formatting-button"
          @clicked="editor.chain().focus().undo().run()">
          undo
        </ButtonX>
        <ButtonX
          class="wysiwyg-formatting-button"
          @clicked="editor.chain().focus().redo().run()">
          redo
        </ButtonX>
        <ButtonX
          :class="[ 'wysiwyg-formatting-button', { 'is-active': editor.isActive({ textAlign: 'left' }) }]"
          @clicked="editor.chain().focus().setTextAlign('left').run()">
          left
        </ButtonX>
        <ButtonX
          :class="[ 'wysiwyg-formatting-button', { 'is-active': editor.isActive({ textAlign: 'center' }) }]"
          @clicked="editor.chain().focus().setTextAlign('center').run()">
          center
        </ButtonX>
        <ButtonX
          :class="[ 'wysiwyg-formatting-button', { 'is-active': editor.isActive({ textAlign: 'right' }) }]"
          @clicked="editor.chain().focus().setTextAlign('right').run()">
          right
        </ButtonX>
        <ButtonX
          :class="[ 'wysiwyg-formatting-button', { 'is-active': editor.isActive({ textAlign: 'justify' }) }]"
          @clicked="editor.chain().focus().setTextAlign('justify').run()">
          justify
        </ButtonX>
        <ButtonX
          :class="[ 'wysiwyg-formatting-button', { 'is-active': editor.isActive('link') }]"
          @clicked="setLink">
          link
        </ButtonX>
      </div>
      <client-only>
        <editor-content
          :id="fieldKey"
          v-model="value"
          :editor="editor"
          :type="inputType"
          :name="fieldKey"
          :value="value"
          :class="['wysiwyg-editor', state]" />
      </client-only>
    </div>

  </div>

</template>

<script>

// ===================================================================== Imports
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'

import Select from '@/components/form/fields/select'
import ButtonX from '@/components/buttons/button-x'

// ====================================================================== Export
export default {
  name: 'FieldWysiwyg',

  components: {
    EditorContent,
    Select,
    ButtonX
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
      headingSelectValue: 0
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
    },
    headingSelectField () {
      return {
        id: `wysiwyg_heading_select|${this.field.id}`,
        scaffold: this.field.scaffold.wysiwyg_heading_select,
        value: this.headingSelectValue
      }
    }
  },

  mounted () {
    this.editor = new Editor({
      content: this.value,
      extensions: [
        StarterKit,
        TextAlign.configure({
          types: ['heading', 'paragraph']
        }),
        Link.configure({
          HTMLAttributes: {
              class: 'wysiwyg-link',
              style: 'text-decoration: underline;'
          },
          openOnClick: false
        }),
        Underline
      ],
      onUpdate: () => {
        this.$emit('updateValue', this.editor.getHTML())
      },
      onSelectionUpdate: ({ editor }) => {
        const anchor = editor.state.selection.$anchor.pos
        const head = editor.state.selection.$head.pos
        const anchorNodeType = editor.state.selection.$anchor.parent.type.name === 'heading' ? editor.state.selection.$anchor.parent.attrs.level : editor.state.selection.$anchor.parent.type.name
        const headNodeType = editor.state.selection.$head.parent.type.name === 'heading' ? editor.state.selection.$head.parent.attrs.level : editor.state.selection.$head.parent.type.name
        if (anchor === head || anchorNodeType === headNodeType) {
          this.showCurrentHeadingValue(anchorNodeType)
        } else {
          this.headingSelectValue = -1 // blanks dropdown if more than one node is selected, should blank if more than one heading type is selected
        }
      }
    })
  },

  beforeDestroy () {
    this.editor.destroy()
  },

  methods: {
    showCurrentHeadingValue (nodeType) {
      switch (nodeType) {
        case 1:
          this.headingSelectValue = 1
          break
        case 2:
          this.headingSelectValue = 2
          break
        default: // default sets it to paragraph/Normal text
          this.headingSelectValue = 0
      }
    },
    updateHeadingSelectNode (value) {
      if (value === 0) {
        this.headingSelectValue = 0 // set the heading option to be shown in the dropdown
        this.editor.chain().focus().setParagraph().run() // change the node type that's currently in focus
      }
      this.headingSelectValue = value
      this.editor.chain().focus().setHeading({ level: value }).run()
    },
    setLink () {
      const previousURL = this.editor.getAttributes('link').href
      const url = window.prompt('URL: ', previousURL)

      if (url === null) {
        return
      }
      if (url === '') {
        this.editor.chain().focus().extendMarkRange('link').unsetLink().toggleUnderline().run()
        return
      }
      this.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).toggleUnderline().run()
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

.wysiwyg-formatting-container {
  display: flex;
  flex-direction: row;
}

.wysiwig-heading-dropdown {
  width: 8rem;
}

.wysiwyg-formatting-button {
  margin-left: .25rem;
  padding: 0 .2rem;
  border: 2px solid $nandor;
  border-radius: 0.625rem;
  background-color: $racingGreen;
  &.is-active {
    border-color: $mandysPink;
  }
}

.wysiwyg-editor {
  padding: 1.5rem;
  border: 2px solid $nandor;
  border-radius: 0.625rem;
  line-height: 1.1;
}

</style>
