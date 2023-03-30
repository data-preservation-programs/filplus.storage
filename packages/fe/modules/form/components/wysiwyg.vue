<template>
  <div v-if="editor" class="wysiwyg-container">

    <!-- ================================================ Formatting Toolbar -->
    <div class="wysiwyg-toolbar">
      <div
        v-for="(toolbarSectionMobileWrapper, wrapperIndex) in toolbarConfig"
        :key="wrapperIndex"
        :class="['toolbar-section-mobile-wrapper', wrapperIndex === 1 && expandMobileToolbar ? 'expanded' : '']">
        <div
          v-for="(toolbarSection, index) in toolbarSectionMobileWrapper"
          :key="index"
          class="toolbar-section">
          <div
            v-for="formatTool in toolbarSection"
            :key="formatTool.name"
            :class="['wysiwyg-formatting-option', formatTool.type === 'input' ? 'input-option' : '']">

            <Select
              v-if="formatTool.type === 'select' && formatTool.include"
              class="wysiwig-formatting-dropdown"
              :field="headingSelectField"
              @updateValue="updateNodeHeading" />

            <ButtonX
              v-if="formatTool.type === 'button-x' && formatTool.include"
              :class="[
                'wysiwyg-formatting-button',
                formatTool.name, isFormatButtonActive(formatTool),
                formatTool.name === 'toolbarToggle' && expandMobileToolbar ? 'expanded': '']"
              @clicked="clickFormatButton(formatTool)">
              <slot v-if="formatTool.label" name="format-button-label" :format-tool="formatTool" />
              <component
                :is="buttonIcon(formatTool.name)"
                v-if="formatTool.name"
                class="toolbar-icon" />
            </ButtonX>

            <div
              v-if="formatTool.userInput"
              :class="[ 'user-input-wrapper', userInputActive === formatTool.name ? 'active' : '' ]">
              <component
                :is="buttonIcon(formatTool.name)"
                class="toolbar-icon" />
              <input
                class="wysiwyg-user-input"
                type="url"
                :placeholder="formatTool.placeholder"
                :value="userInputValue[formatTool.name] ? userInputValue[formatTool.name] : ''"
                @input="updateUserInputValue($event.target.value, formatTool.name)" />
              <ButtonX
                class="user-input-submit"
                theme="mineral-green"
                @clicked="submitUserInput(formatTool.name)">
                <span v-if="formatTool.name === 'link'">
                  {{ editor.isActive('link') ? formatTool.buttonText[0] : formatTool.buttonText[1] }}
                </span>
                <span v-if="formatTool.name === 'imageButton'">{{ formatTool.buttonText }}</span>
              </ButtonX>
            </div>

            <div v-if="formatTool.type === 'input' && formatTool.include" class="input-wrapper">
              <slot v-if="formatTool.label" name="format-input-label" :format-tool="formatTool" />
              <label
                v-if="!formatTool.label"
                :for="formatTool.name">
                <component
                  :is="buttonIcon(formatTool.name)"
                  class="toolbar-icon" />
              </label>
              <input
                :id="formatTool.name"
                :type="formatTool.inputType"
                :value="showCurrentColor(formatTool)"
                class="wysiwyg-formatting-input"
                @input="clickColorInputButton(formatTool, $event.target.value)">
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================= Edior -->
    <client-only>
      <EditorContent
        :editor="editor"
        class="wysiwyg-editor markdown-user-input" />
      <div class="wysiwyg-char-count" v-html="`Character count: ${editor.storage.characterCount.characters()}`" />
    </client-only>

  </div>
</template>

<script>
// ===================================================================== Imports
// /////////////////////////////////////////////////////////////////// libraries
import { Editor, EditorContent } from '@tiptap/vue-2'
import { StarterKit } from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { Link } from '@tiptap/extension-link'
import { Underline } from '@tiptap/extension-underline'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { Image } from '@tiptap/extension-image'
import { Placeholder } from '@tiptap/extension-placeholder'
import { CharacterCount } from '@tiptap/extension-character-count'
import Kramed from 'kramed'

// ////////////////////////////////////////////////////////////////// components
import ButtonX from '@/components/buttons/button-x'
import Select from '@/components/form/fields/select'

// /////////////////////////////////////////////////////////////////////// icons
import IconBlockquote from '@/components/icons/blockquote'
import IconBulletList from '@/components/icons/bullet-list'
import IconCenterAlign from '@/components/icons/center-align'
import IconCodeBlock from '@/components/icons/code-block'
import IconCode from '@/components/icons/code'
import IconHighlight from '@/components/icons/highlight'
import IconImage from '@/components/icons/image'
import IconJustify from '@/components/icons/justify'
import IconLeftAlign from '@/components/icons/left-align'
import IconLink from '@/components/icons/link'
import IconOrderedList from '@/components/icons/ordered-list'
import IconRedoArrow from '@/components/icons/redo-arrow'
import IconRightAlign from '@/components/icons/right-align'
import IconTable from '@/components/icons/table'
import IconTaskList from '@/components/icons/task-list'
import IconUndoArrow from '@/components/icons/undo-arrow'
import IconChevron from '@/components/icons/chevron'

// ====================================================================== Export
export default {
  name: 'Wysiwyg',

  components: {
    EditorContent,
    Select,
    ButtonX,
    IconBlockquote,
    IconBulletList,
    IconCenterAlign,
    IconCodeBlock,
    IconCode,
    IconHighlight,
    IconImage,
    IconJustify,
    IconLeftAlign,
    IconLink,
    IconOrderedList,
    IconRedoArrow,
    IconRightAlign,
    IconTable,
    IconTaskList,
    IconUndoArrow,
    IconChevron
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
      renderer: false,
      headingSelectValue: 0,
      userInputActive: false,
      userInputValue: {
        imageButton: false,
        link: false
      },
      expandMobileToolbar: false,
      toolbar: [
        [
          [{
            name: 'heading-select',
            type: 'select',
            include: true
          }],
          [
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
              name: 'strike',
              label: '<s>S</s>',
              type: 'button-x',
              include: true
            },
            {
              name: 'superscript',
              label: '<p>A<sup>1</sup></p>',
              type: 'button-x',
              include: true
            },
            {
              name: 'subscript',
              label: '<p>A<sub>1</sub></p>',
              type: 'button-x',
              include: true
            },
            {
              name: 'textColor',
              label: '<p>A</p>',
              type: 'input',
              inputType: 'color',
              include: true
            },
            {
              name: 'highlight',
              type: 'input',
              inputType: 'color',
              include: true
            },
            {
              name: 'toolbarToggle',
              type: 'button-x',
              include: true
            }
          ]
        ],
        [
          [
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
              name: 'taskList',
              type: 'button-x',
              include: true
            }
          ],
          [
            {
              name: 'leftAlign',
              checkActive: { textAlign: 'left' },
              type: 'button-x',
              include: true
            },
            {
              name: 'centerAlign',
              checkActive: { textAlign: 'center' },
              type: 'button-x',
              include: true
            },
            {
              name: 'rightAlign',
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
              name: 'blockquote',
              type: 'button-x',
              include: true
            },
            {
              name: 'imageButton',
              type: 'button-x',
              userInput: true,
              placeholder: 'Link an image',
              buttonText: 'Apply',
              include: true
            },
            {
              name: 'link',
              type: 'button-x',
              userInput: true,
              placeholder: 'Paste a link',
              buttonText: ['Unlink', 'Link'],
              include: true
            },
            {
              name: 'code',
              type: 'button-x',
              include: true
            },
            {
              name: 'codeBlock',
              type: 'button-x',
              include: true
            }
          ],
          [
            {
              name: 'undo',
              type: 'button-x',
              include: true
            },
            {
              name: 'redo',
              type: 'button-x',
              include: true
            }
          ]
        ]
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
            { label: 'p' },
            { label: 'H1' },
            { label: 'H2' },
            { label: 'H3' }
          ],
          defaultValue: 0
        },
        value: this.headingSelectValue
      }
    },
    placeholder () {
      return this.scaffold.placeholder
    }
  },

  mounted () {
    this.renderer = new Kramed.Renderer()
    this.editor = new Editor({
      content: this.value,
      extensions: [
        StarterKit.configure({
          listItem: {
            HTMLAttributes: {
              class: 'list-item'
            }
          }
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph']
        }),
        Link.configure({
          HTMLAttributes: {
            class: 'wysiwyg-link'
          },
          openOnClick: false
        }),
        Underline,
        Superscript,
        Subscript,
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
        TaskList.configure({ HTMLAttributes: { class: 'task-list' } }),
        TaskItem.configure({
          nested: true,
          HTMLAttributes: {
            class: 'task-item'
          }
        }),
        Image,
        Placeholder.configure({ placeholder: this.placeholder }),
        CharacterCount
      ],
      editorProps: {
        handlePaste: (view, event) => {
          const pastedText = event.clipboardData.getData('text/plain')
          const pastedHTML = event.clipboardData.getData('text/html')
          if (pastedHTML) {
            return false
          }
          if (pastedText) {
            const markdownParsed = Kramed(pastedText, { renderer: this.renderer })
            this.editor.commands.insertContentAt(
              {
                from: view.state.selection.$anchor.pos,
                to: view.state.selection.$head.pos
              },
              markdownParsed,
              {
                parseOptions: { preserveWhitespace: true }
              }
            )
          }
          return true
        }
      },
      onUpdate: () => {
        const value = this.editor.getHTML()
        this.$emit('updateContentValue', value)
      },
      onSelectionUpdate: ({ editor }) => {
        // update heading select dropdown for current selection
        const anchor = editor.state.selection.$anchor.pos
        const head = editor.state.selection.$head.pos
        const anchorNodeType = editor.state.selection.$anchor.parent.type.name === 'heading' ? editor.state.selection.$anchor.parent.attrs.level : editor.state.selection.$anchor.parent.type.name
        const headNodeType = editor.state.selection.$head.parent.type.name === 'heading' ? editor.state.selection.$head.parent.attrs.level : editor.state.selection.$head.parent.type.name
        if (anchor === head || anchorNodeType === headNodeType) {
          this.showCurrentHeadingValue(anchorNodeType)
        } else {
          this.headingSelectValue = -1
        }
        // update userInputValue.link for current selection
        const isLink = this.editor.isActive('link')
        const linkValue = this.userInputValue.link
        switch (true) {
          case (isLink && linkValue):
            break
          case (isLink && !linkValue):
            this.userInputValue.link = this.editor.getAttributes('link').href
            break
          case (!isLink):
            this.userInputValue.link = false
        }
      }
    })
  },

  beforeDestroy () {
    this.editor.destroy()
  },

  methods: {
    buttonIcon (iconName) {
      let component = false
      switch (iconName) {
        case 'blockquote' : component = 'IconBlockquote'; break
        case 'bulletList' : component = 'IconBulletList'; break
        case 'centerAlign' : component = 'IconCenterAlign'; break
        case 'codeBlock' : component = 'IconCodeBlock'; break
        case 'code' : component = 'IconCode'; break
        case 'highlight' : component = 'IconHighlight'; break
        case 'imageButton' : component = 'IconImage'; break
        case 'justify' : component = 'IconJustify'; break
        case 'leftAlign' : component = 'IconLeftAlign'; break
        case 'link' : component = 'IconLink'; break
        case 'orderedList' : component = 'IconOrderedList'; break
        case 'redo' : component = 'IconRedoArrow'; break
        case 'rightAlign' : component = 'IconRightAlign'; break
        case 'table' : component = 'IconTable'; break
        case 'taskList' : component = 'IconTaskList'; break
        case 'toolbarToggle' : component = 'IconChevron'; break
        case 'undo' : component = 'IconUndoArrow'; break
      }
      return component
    },
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
    toggleUserInputActive (toolName) {
      if (this.userInputActive === toolName) {
        this.userInputActive = false
      } else {
        switch (toolName) {
          case 'imageButton':
            this.userInputActive = 'imageButton'
            break
          case 'link':
            this.userInputActive = 'link'
        }
      }
    },
    updateUserInputValue (value, toolName) {
      if (value) {
        this.userInputValue[toolName] = value
      }
    },
    submitUserInput (toolName) {
      const userInput = this.userInputValue[toolName]
      if (userInput) {
        switch (toolName) {
          case 'link':
            this.editor.chain().focus().toggleLink({ href: userInput }).run()
            this.toggleUserInputActive(toolName)
            break
          case 'imageButton':
            this.editor.chain().focus().setImage({ src: userInput }).run()
            this.toggleUserInputActive(toolName)
        }
        this.userInputValue[toolName] = false
      }
    },
    isFormatButtonActive (formatTool) {
      const toolName = formatTool.name
      const checkActive = formatTool.checkActive
      switch (true) {
        case (toolName === 'toggleToolbar'):
          return ''
        case (checkActive !== undefined):
          return this.editor.isActive(checkActive) ? 'is-active' : ''
        default: return this.editor.isActive(toolName) ? 'is-active' : ''
      }
    },
    clickFormatButton (formatTool) {
      const isActive = formatTool.checkActive
      const toolName = formatTool.name
      if (isActive !== undefined) {
        this.editor.chain().focus().setTextAlign(isActive.textAlign).run()
      }
      switch (toolName) {
        case 'bold':
          this.editor.chain().focus().toggleBold().run()
          break
        case 'italic':
          this.editor.chain().focus().toggleItalic().run()
          break
        case 'underline':
          this.editor.chain().focus().toggleUnderline().run()
          break
        case 'strike':
          this.editor.chain().focus().toggleStrike().run()
          break
        case 'superscript':
          this.editor.chain().focus().toggleSuperscript().run()
          break
        case 'subscript':
          this.editor.commands.toggleSubscript()
          break
        case 'blockquote':
          this.editor.chain().focus().toggleBlockquote().run()
          break
        case 'bulletList':
          this.editor.chain().focus().toggleBulletList().run()
          break
        case 'orderedList':
          this.editor.chain().focus().toggleOrderedList().run()
          break
        case 'taskList':
          this.editor.chain().focus().toggleTaskList().run()
          break
        case 'imageButton':
        case 'link':
          this.toggleUserInputActive(toolName)
          break
        case 'code':
          this.editor.chain().focus().toggleCode().run()
          break
        case 'codeBlock':
          this.editor.chain().focus().toggleCodeBlock().run()
          break
        case 'undo':
          this.editor.chain().focus().undo().run()
          break
        case 'redo':
          this.editor.chain().focus().redo().run()
          break
        case 'toolbarToggle':
          this.expandMobileToolbar = !this.expandMobileToolbar
          break
      }
    },
    showCurrentColor (formatTool) {
      switch (formatTool.name) {
        case 'textColor':
          return this.editor.getAttributes('textStyle').color || '#F6F5FF'
        case 'highlight':
          return this.editor.getAttributes('highlight').color || '#B7F651'
      }
    },
    clickColorInputButton (formatTool, value) {
      switch (formatTool.name) {
        case 'textColor':
          this.editor.chain().focus().setColor(value).run()
          break
        case 'highlight':
          this.editor.chain().focus().toggleHighlight({ color: value }).run()
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.wysiwyg-toolbar {
  display: flex;
  @include medium {
  flex-direction: column;
  }
}

.toolbar-section-mobile-wrapper, .toolbar-section {
  display: flex;
}

.toolbar-section-mobile-wrapper {
  @include medium {
    &:is(:first-child) {
      .toolbar-section:is(:last-child) {
        flex: 1;
        .wysiwyg-formatting-option:is(:last-child) {
          position: absolute;
          right: 0;
        }
        .toolbarToggle {
          display: block;
        }
      }
    }
    &:is(:last-child) {
      display: none;
      &.expanded {
        display: flex;
      }
    }
  }
}

.toolbar-icon {
  height: toRem(14);
}

.toolbarToggle {
  display: none;
  .icon-chevron {
    width: toRem(14);
    transition: 150ms ease;
  }
  &.expanded {
    .icon-chevron {
      transform: rotate(180deg);
    }
  }
}

.wysiwig-formatting-dropdown {
  min-width: 4rem;
  :deep(.select.custom) {
    border: none;
  }
  :deep(.custom) {
    padding: toRem(9) 0 toRem(5) toRem(4);
  }
}
.wysiwyg-formatting-option {
  align-self: center;
  position: relative;
  padding: toRem(1) 0;
  margin-left: toRem(3);
  &:first-child {
    margin-left: toRem(13);
  }
  &:last-child {
    margin-right: toRem(13);
  }
  .wysiwig-formatting-dropdown.field-select {
    height: unset;
  }
  .user-input-wrapper {
    &.active {
      display: flex;
      z-index: 50;
    }
    display: none;
    align-items: center;
    position: absolute;
    left: -150%;
    top: 85%;
    border-radius: toRem(4);
    background-color: $aztec;
    .toolbar-icon{
      margin: toRem(8) toRem(13) toRem(8) toRem(7) ;
    }
    .wysiwyg-user-input {
      .input-container > .input {
        border: none;
        background: salmon;
      }
      @include p3;
      max-width: 6rem;
    }
    .user-input-submit {
      margin: toRem(3);
    }
  }
}

.wysiwyg-formatting-button {
  padding: 0 toRem(7);
  border-radius: toRem(3);
  line-height: 1.6;
  :deep(.button-content) {
    @include p2;
  }
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 toRem(7);
  border-radius: toRem(3);
  label {
    line-height: 1;
  }
  input {
    height: 20%;
    width: calc(100% + toRem(10));
  }
}

.wysiwyg-editor {
  padding: 1.5rem;
  line-height: 1.1;
  :deep(p.is-editor-empty:first-child::before) { // placeholder only on first line
  // p.is-empty::before { // placeholder on every new line
  color: rgba($aquaSqueeze, 0.7);
  content: attr(data-placeholder);
  background: salmon;
  float: left;
  height: 0;
  pointer-events: none;
}
  :deep(.task-list) {
    list-style-type: none;
    font-size: toRem(16);
    line-height: leading(25, 16);
    .task-item {
      display: flex;
      align-items: flex-start;
      width: calc(100% - 1.75rem);
      label {
        margin-right: .5rem;
      }
      > div {
        width: 100%;
      }
      &::before {
        display: none;
      }
    }
  }
  :deep(img) {
    max-width: 100%;
  }
}

.wysiwyg-char-count {
  @include p3;
  color: rgba($aquaSqueeze, 0.7);
  margin-right: toRem(13);
  text-align: right;
}

</style>
