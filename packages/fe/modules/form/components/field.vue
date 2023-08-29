<template>
  <component
    :is="rootHtmlTag"
    v-if="displayField && field"
    :class="['field', state, { disabled }]">

    <slot
      :field="field"
      :field-id="fieldId"
      :state="state"
      :required="required"
      :disabled="disabled"
      :validation-message="validationMessage"
      :update-value="updateValue"
      :toggle-state="toggleState" />

  </component>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import Debounce from 'lodash/debounce'

import useValidateField from '@/modules/form/composables/use-validate-field'

// ====================================================================== Export
export default {
  name: 'FormField',

  props: {
    scaffold: {
      type: Object,
      required: true
    },
    forceDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    forceValidate: {
      type: Boolean,
      required: false,
      default: true
    },
    deregisterOnDestroy: {
      type: Boolean,
      required: false,
      default: true
    },
    /**
     * On occasions where the final root element in field-conditional.vue render
     * must be something specific. Such as when wrapping a <tbody> in a field-standalone,
     * it cannot be a div as the wrapper. It must be <tbody> at the root to prevent
     * SSR hydration errors.
     */
    rootHtmlTag: {
      type: String,
      required: false,
      default: 'div'
    }
  },

  data () {
    const self = this
    return {
      id: self.scaffold.modelKey || self.scaffold.id || self.$uuid.v4(),
      formId: self.scaffold.formId,
      modelKey: self.scaffold.modelKey,
      debounceSaveFieldToLsUponValueUpdate: null
    }
  },

  computed: {
    ...mapGetters({
      fields: 'form/fields',
      models: 'form/models'
    }),
    field () {
      return this.fields.find(field => field.id === this.id)
    },
    model () {
      return this.models.find(model => model.id === this.formId)
    },
    fieldId () {
      return this.field.id
    },
    type () {
      return this.scaffold.type
    },
    displayField () {
      return this.field.displayField
    },
    state () {
      return this.field.state
    },
    required () {
      return this.scaffold.required
    },
    disabled () {
      return this.forceDisabled || this.scaffold.disabled
    },
    deregister () {
      if (this.scaffold.hasOwnProperty('deregisterOnDestroy')) { return this.scaffold.deregisterOnDestroy }
      return this.deregisterOnDestroy
    },
    chars () {
      return this.scaffold.chars
    },
    react () {
      return this.scaffold.react
    },
    conditions () {
      return this.scaffold.conditions
    },
    validationMessage () {
      const validationMessage = this.scaffold.validationMessage
      const validation = this.field.validation
      if (!validationMessage || !validation) { return null }
      return validationMessage[validation]
    }
  },

  created () {
    if (!this.field) {
      this.setField(this.compileField())
    }
  },

  mounted () {
    this.$nextTick(async () => {
      const field = await this.getLocalStorageValue() || {
        id: this.id,
        mounted: this.displayField
      }
      await this.setField(field)
      this.$nuxt.$on('fieldValueUpdated', (field) => {
        this.detectConditions(field)
        this.initializeReactions(field)
      })
      this.$nuxt.$on('fieldUpdateValue', (payload) => {
        if (this.fieldId === payload.fieldId) {
          this.updateValue(payload.value)
        }
      })
      this.detectConditions(this.field)
      this.debounceSaveFieldToLsUponValueUpdate = Debounce(() => {
        this.$field.saveFieldToLocalStorage(this.field)
      }, 500)
    })
  },

  beforeDestroy () {
    if (this.field) {
      this.setField({
        id: this.id,
        mounted: false
      })
    }
  },

  methods: {
    ...mapActions({
      setField: 'form/setField',
      removeField: 'form/removeField'
    }),
    compileField () {
      const scaffold = this.scaffold
      const value = this.getDefaultValue()
      const conditions = scaffold.conditions
      const displayField = !conditions || (conditions && conditions.length === 0)
      const field = { // `groupId` and `fieldKey` are reserved keys, set in `array.vue`
        id: this.id,
        formId: this.formId,
        modelKey: this.modelKey,
        validate: this.forceValidate || true,
        state: 'not-started',
        originalState: null,
        validation: null,
        originalValidation: null,
        displayField,
        mounted: displayField,
        value,
        originalValue: value,
        scaffold
      }
      const { state } = useValidateField(field)
      if (state === 'completed') {
        field.state = state
      }
      field.originalState = state
      field.originalValidation = state
      return field
    },
    async toggleState (focused) {
      const update = { id: this.id }
      if (focused) {
        update.state = 'in-progress'
      } else {
        const check = useValidateField(this.field)
        update.state = check.state
        update.originalState = check.state
        update.validation = check.validation
        update.originalValidation = check.originalValidation
      }
      await this.setField(update)
      if (!focused) {
        this.$field.saveFieldToLocalStorage(this.field)
      }
    },
    getNullStateValue () {
      const type = this.type
      const scaffold = this.scaffold
      let value
      switch (type) {
        case 'checkbox' : value = -1; break
        case 'radio' : value = -1; break
        case 'select' : value = []; break
        case 'range' : value = scaffold.min; break
        case 'array' : value = []; break
        default : value = ''; break
      }
      return value
    },
    getDefaultValue () {
      const dualValueFields = ['select', 'radio', 'checkbox'] // fields that can contain both a String and a Number (index) as the value/defaultValue
      const model = this.model
      const modelKey = this.modelKey
      const type = this.type
      const scaffold = this.scaffold
      const defaultValue = scaffold.defaultValue
      const options = scaffold.options
      let value = this.getNullStateValue() // get the base value
      // If default value is set in the scaffold, get that
      if (scaffold.hasOwnProperty('defaultValue') && defaultValue !== '') {
        value = defaultValue
      }
      // If default value is set in the model, get that
      if (model && model.data.hasOwnProperty(modelKey) && model.data[modelKey] !== null) {
        value = model.data[modelKey]
      }
      // defaultValue can be an array of indexes, a single index Number, an array of labels or a single label String
      if (dualValueFields.includes(type)) {
        if (!Array.isArray(value)) { // if defaultValue is not an array, turn it into one
          value = [value]
        }
        const compiled = []
        value.forEach((entry) => { // convert labels to indexes so final output ex: [2, 3, 7]
          const found = options.findIndex(option => option.label === entry)
          if (found !== -1 && !compiled.includes(found)) {
            compiled.push(found)
          } else if (typeof entry === 'number' && options[entry] && !compiled.includes(entry)) {
            compiled.push(entry)
          }
        })
        value = compiled
      }
      return value
    },
    async updateValue (value) {
      const updated = {
        id: this.id,
        value
      }
      await this.setField(updated)
      this.debounceSaveFieldToLsUponValueUpdate()
      this.$nuxt.$emit('fieldValueUpdated', updated)
    },
    async initializeReactions (updatedField) {
      const react = this.react
      if (!react) { return }
      const len = react.length
      for (let i = 0; i < len; i++) {
        const reaction = react[i]
        if (reaction.modelKey === updatedField.id) {
          const updated = {
            id: this.id,
            value: this[reaction.func](...Object.values(reaction.args))
          }
          const check = useValidateField(this.field)
          updated.state = check.state
          updated.validation = check.validation
          await this.setField(updated)
          this.$field.saveFieldToLocalStorage(this.field)
        }
      }
    },
    async detectConditions (updatedField) {
      const conditions = this.conditions
      if (!conditions || updatedField.id === this.field.id) { return }
      const dualValueFields = ['select', 'radio', 'checkbox']
      const len = conditions.length
      let displayField = [true]
      for (let i = 0; i < len; i++) {
        const condition = conditions[i]
        const eq = `${condition.eq}`
        const neq = `${condition.neq}`
        const field = await this.$field.get(condition.modelKey)
        if (field) {
          const type = field.scaffold.type
          let value = `${field.value}`
          if (dualValueFields.includes(type)) {
            value = value[0]
          }
          if (eq !== 'undefined') {
            displayField.push(value === eq)
          } else if (neq !== 'undefined') {
            displayField.push(value !== neq)
          }
        }
      }
      displayField = displayField.every(val => val === true)
      if (this.displayField !== displayField) {
        const updated = {
          id: this.id,
          validate: displayField,
          displayField,
          mounted: displayField
        }
        await this.setField(updated)
        this.$field.saveFieldToLocalStorage(this.field)
      }
    },
    getLocalStorageValue () {
      const form = JSON.parse(this.$ls.get(`form__${this.formId}`))
      if (!form) { return undefined }
      const field = form[this.modelKey]
      if (!field) { return undefined }
      const check = useValidateField(field)
      field.state = check.state
      field.originalState = check.state
      field.validation = check.validation
      field.originalValidation = check.originalValidation
      return field
    }
  }
}
</script>
