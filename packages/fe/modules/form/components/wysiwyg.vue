<template>
  <div v-if="editor" class="wysiwyg-container">

    <!-- =============================================== Formatting Toolbar -->
    <div class="wysiwyg-formatting-toolbar">
      <div
        v-for="formatTool in toolbarConfig"
        :key="formatTool.name"
        class="wysiwyg-formatting-option">
        <Select
          v-if="formatTool.type === 'select' && formatTool.include"
          class="wysiwig-formatting-dropdown"
          :field="headingSelectField"
          @updateValue="updateNodeHeading" />
        <ButtonX
          v-if="formatTool.type === 'button-x' && formatTool.include"
          :class="[ 'wysiwyg-formatting-button', formatTool.name, isFormatButtonActive(formatTool)]"
          @clicked="clickFormatButton(formatTool)">
          <slot name="format-tool-label" :format-tool="formatTool" />
        </ButtonX>
      </div>
    </div>

    <client-only>
      <EditorContent
        :editor="editor"
        class="wysiwyg-editor" />
    </client-only>

  </div>
</template>

<script>
// ===================================================================== Imports
import { Editor, EditorContent } from '@tiptap/vue-2'
import { StarterKit } from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { Link } from '@tiptap/extension-link'
import { Underline } from '@tiptap/extension-underline'

import ButtonX from '@/components/buttons/button-x'
import Select from '@/components/form/fields/select'

// ====================================================================== Export
export default {
  name: 'Wysiwyg',

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
      headingSelectValue: 0,
      toolbar: [
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
    state () {
      return this.field.state
    },
    toolbarConfig () {
      if (this.scaffold.toolbarConfig && this.scaffold.toolbarConfig.length > 0) {
        return this.scaffold.toolbarConfig
      }
      return this.toolbar
    },
    headingSelectField () {
      return {
        id: `wysiwyg_heading_select|${this.field.id}`,
        scaffold: {
          type: 'select',
          modelKey: 'wysiwyg_heading_select',
          label: '',
          required: true,
          output: 'option',
          react: {
            fieldKey: 'wysiwyg_heading_select',
            func: '$selectOption',
            args: {
              value_from_field: 'wysiwyg_heading_select'
            }
          },
          options: [
            { label: 'Normal text' },
            { label: 'Heading 1' },
            { label: 'Heading 2' }
          ],
          defaultValue: 0
        },
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
            class: 'wysiwyg-link'
          },
          openOnClick: false
        }),
        Underline
      ],
      onUpdate: () => {
        const value = this.editor.getHTML()
        this.$emit('updateContentValue', value)
      },
      onSelectionUpdate: ({ editor }) => {
        const anchor = editor.state.selection.$anchor.pos
        const head = editor.state.selection.$head.pos
        const anchorNodeType = editor.state.selection.$anchor.parent.type.name === 'heading' ? editor.state.selection.$anchor.parent.attrs.level : editor.state.selection.$anchor.parent.type.name
        const headNodeType = editor.state.selection.$head.parent.type.name === 'heading' ? editor.state.selection.$head.parent.attrs.level : editor.state.selection.$head.parent.type.name
        if (anchor === head || anchorNodeType === headNodeType) {
          this.showCurrentHeadingValue(anchorNodeType)
        } else {
          this.headingSelectValue = -1
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
    updateNodeHeading (value) {
      if (value === 0) {
        this.editor.chain().focus().setParagraph().run() // change the node type that's currently in focus
        this.headingSelectValue = 0 // set the heading option to be shown in the dropdown
      }
      this.editor.chain().focus().setHeading({ level: value }).run()
      this.headingSelectValue = value
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
    },
    isFormatButtonActive (formatTool) {
      if (formatTool.checkActive !== undefined) {
        return this.editor.isActive(formatTool.checkActive) ? 'is-active' : ''
      }
      return this.editor.isActive(formatTool.name) ? 'is-active' : ''
    },
    clickFormatButton (formatTool) {
      if (formatTool.checkActive !== undefined) {
        this.editor.chain().focus().setTextAlign(formatTool.name).run()
      }
      switch (formatTool.name) {
        case 'bold':
          this.editor.chain().focus().toggleBold().run()
          break
        case 'italic':
          this.editor.chain().focus().toggleItalic().run()
          break
        case 'underline':
          this.editor.chain().focus().toggleUnderline().run()
          break
        case 'bulletList':
          this.editor.chain().focus().toggleBulletList().run()
          break
        case 'orderedList':
          this.editor.chain().focus().toggleOrderedList().run()
          break
        case 'undo':
          this.editor.chain().focus().undo().run()
          break
        case 'redo':
          this.editor.chain().focus().redo().run()
          break
        case 'link':
          this.setLink()
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.wysiwyg-formatting-toolbar {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
}

.wysiwig-formatting-dropdown {
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
