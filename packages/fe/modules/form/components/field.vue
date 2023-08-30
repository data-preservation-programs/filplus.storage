<template>
  <component
    :is="rootHtmlTag"
    v-if="displayField && field"
    :class="['field', state, { disabled }]">

    <slot
      :field="field"
      :field-id="id"
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
      fields: 'form/fields'
    }),
    field () {
      return this.fields.find(field => field.id === this.id)
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
      this.setField(
        this.$field.register(
          this.id,
          this.formId,
          this.scaffold,
          this.forceValidate
        )
      )
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
        if (this.id === payload.fieldId) {
          this.updateValue(payload.value)
        }
      })
      this.detectConditions(this.field, 'mounted')
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
    async detectConditions (updatedField, loadState) {
      const conditions = this.conditions
      if (!conditions && (updatedField.id === this.field.id || loadState !== 'mounted')) { return }
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
            value = `${value[0]}`
          }
          const valueIsNullState = this.$field.valueIsNullState(field)
          if (valueIsNullState) {
            displayField.push(false)
          } else if (eq !== 'undefined') {
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
        if (loadState !== 'mounted') {
          this.$field.saveFieldToLocalStorage(this.field)
        }
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
