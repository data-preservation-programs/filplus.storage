<script>
// ====================================================================== Export
export default {
  name: 'Field',

  props: {
    scaffold: {
      type: Object,
      required: true
    },
    formId: {
      type: String,
      required: true
    },
    fieldKey: {
      type: String,
      required: true
    },
    groupId: {
      type: String,
      required: false,
      default: ''
    },
    validateOnEntry: {
      type: Boolean,
      required: false,
      default: false
    },
    validateAcrossRoutes: {
      type: Boolean,
      required: false,
      default: false
    },
    deregisterOnDestroy: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    const id = `${this.fieldKey}|${this.formId}`
    return {
      id
    }
  },

  computed: {
    field () {
      return this.$field(this.id).get()
    },
    value () {
      return this.field ? this.field.value : false
    },
    type () {
      const type = this.scaffold.type
      let component = false
      switch (type) {
        case 'input' : component = 'FieldInput'; break
        case 'textarea' : component = 'FieldTextarea'; break
        case 'range' : component = 'FieldRange'; break
        case 'checkbox' : component = 'FieldCheckbox'; break
        case 'radio' : component = 'FieldRadio'; break
        case 'select' : component = 'FieldSelect'; break
      }
      return component
    },
    min () {
      return this.scaffold.min
    },
    max () {
      return this.scaffold.max
    },
    description () {
      return this.scaffold.description
    },
    validationMessage () {
      const message = this.scaffold.validationMessage
      if (!message) { return false }
      return message[this.field.validation]
    }
  },

  watch: {
    value (value) {
      if (this.validateOnEntry) {
        this.$field(this.id).validate()
      }
    }
  },

  async created () {
    if (!this.field) {
      await this.$field(this.id).register(this.formId, this.fieldKey, this.scaffold)
    } else {
      await this.$field(this.id).update({ validate: true })
    }
  },

  async beforeDestroy () {
    if (!this.validateAcrossRoutes) {
      await this.$field(this.id).update({ validate: false })
    }
    if (this.deregisterOnDestroy) {
      this.$field(this.id).remove()
    }
  },

  methods: {
    updateValue (value) {
      this.$field(this.id).updateValue(value)
    }
  },

  render () {
    return this.$scopedSlots.default({
      updateValue: this.updateValue,
      field: this.field,
      type: this.type,
      validationMessage: this.validationMessage
    })
  }
}
</script>
