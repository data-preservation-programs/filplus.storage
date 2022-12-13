<script>
// ===================================================================== Imports
import { mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

// ====================================================================== Export
export default {
  name: 'Field',

  props: {
    scaffold: {
      type: Object,
      required: true
    },
    value: {
      type: [Object, String, Number, Boolean],
      required: false,
      default: false
    },
    formId: {
      type: String,
      required: true
    },
    groupId: {
      type: String,
      required: false,
      default: ''
    },
    forceDisableFields: {
      type: Boolean,
      required: false,
      default: false
    },
    deregisterFormFieldOnDestroy: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    const id = `${this.scaffold.field_key}|${this.formId}`
    return {
      id
    }
  },

  computed: {
    field () {
      const field = CloneDeep(this.$field(this.id))
      if (!field) { return false }
      field.disabled = this.forceDisableFields || field.disabled
      return field
    },
    type () {
      const type = this.field.type
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
      return this.field.min
    },
    max () {
      return this.field.max
    },
    description () {
      return this.field.description
    },
    validationMessage () {
      const message = this.field.validation_message
      if (!message) { return false }
      return message[this.field.validation]
    }
  },

  async mounted () {
    if (!this.field) {
      const formId = this.formId
      const scaffold = this.scaffold
      const value = this.getValue(scaffold)
      this.registerFormField(Object.assign(CloneDeep(scaffold), {
        id: this.id,
        formId,
        value,
        originalValue: value,
        state: 'valid',
        validate: true,
        validation: false
      }))
    } else {
      await this.updateFormField(Object.assign(CloneDeep(this.field), {
        validate: true
      }))
    }
  },

  async beforeDestroy () {
    await this.updateFormField(Object.assign(CloneDeep(this.field), {
      state: 'valid',
      validate: false,
      validation: false
    }))
    if (this.deregisterFormFieldOnDestroy) {
      this.deregisterFormField(this.id)
    }
  },

  methods: {
    ...mapActions({
      registerFormField: 'form/registerFormField',
      deregisterFormField: 'form/deregisterFormField',
      updateFormField: 'form/updateFormField'
    }),
    getValue (scaffold) {
      if (scaffold.hasOwnProperty('default_value')) { return this.getDefaultValue(scaffold) }
      return typeof this.value === 'boolean' && !this.value ? this.getBaseValue(scaffold) : this.value
    },
    getDefaultValue (scaffold) {
      const type = scaffold.type
      const defaultValue = scaffold.default_value
      if ((type === 'select' || type === 'radio' || type === 'checkbox') && typeof defaultValue === 'string') {
        return scaffold.options.findIndex(option => option.label === defaultValue)
      }
      return scaffold.default_value
    },
    getBaseValue (scaffold) {
      const type = scaffold.type
      let value = ''
      switch (type) {
        case 'checkbox' : value = false; break
        case 'select' : value = -1; break
        case 'range' : value = scaffold.min; break
        default : value = ''; break
      }
      return value
    },
    updateValue (value) {
      const type = this.field.type
      const inputType = this.field.input_type
      let parsed = value
      if ((type === 'input' && inputType === 'number') || type === 'range') {
        parsed = value !== '' ? parseFloat(value) : null
      }
      const field = CloneDeep(this.field)
      field.value = parsed
      field.state = field.value !== field.originalValue ? 'caution' : 'valid'
      field.validation = false
      this.updateFormField(field)
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
