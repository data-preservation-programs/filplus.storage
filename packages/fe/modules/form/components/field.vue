<template>
  <component
    :is="rootHtmlTag"
    v-if="displayField && field"
    :class="['field', { disabled }]">

    <slot
      :field="field"
      :field-id="fieldId"
      :required="required"
      :disabled="disabled"
      :validation-message="validationMessage"
      :update-value="updateValue" />

  </component>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

import useValidateField from '@/modules/form/composables/validate-field'

// ====================================================================== Export
export default {
  name: 'Field',

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
    return {
      displayField: false
    }
  },

  async fetch () {
    const scaffold = this.scaffold
    if (!this.field) {
      const value = this.getDefaultValue()
      const field = {
        id: scaffold.modelKey,
        formId: scaffold.formId,
        modelKey: scaffold.modelKey,
        validate: this.forceValidate || true,
        state: 'valid',
        originalState: null,
        validation: null,
        originalValidation: null,
        value,
        originalValue: value,
        scaffold
      }
      const { state } = await useValidateField(field)
      field.originalState = state
      field.originalValidation = state
      await this.setField(field)
    }
  },

  computed: {
    ...mapGetters({
      fields: 'form/fields'
    }),
    field () {
      return this.fields.find(field => field.id === this.scaffold.modelKey)
    },
    fieldId () {
      return this.field.id
    },
    type () {
      return this.scaffold.type
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
    // validate () {
    //   return this.forceValidate || true
    // },
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
    const conditions = this.conditions
    if (!conditions || (conditions && conditions.length === 0)) {
      this.displayField = true
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.$nuxt.$on('fieldValueUpdated', (field) => {
        this.initializeReactions(field)
        this.detectConditions()
      })
      this.$nuxt.$on('fieldUpdateValue', (payload) => {
        if (this.fieldId === payload.fieldId) {
          this.updateValue(payload.value)
        }
      })
      this.detectConditions()
    })
  },

  beforeDestroy () {
    if (!module.hot) { // or try this https://github.com/vuejs/vue/issues/6518#issuecomment-855802062
      this.removeField(this.field.id)
    }
  },

  methods: {
    ...mapActions({
      setField: 'form/setField',
      removeField: 'form/removeField'
    }),
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
      const type = this.type
      const scaffold = this.scaffold
      const defaultValue = scaffold.defaultValue
      const options = scaffold.options
      let value = defaultValue
      // If a default value is set in the field scaffold, grab that instead (both for regular getValue calls as well as if it's a reset)
      if (scaffold.hasOwnProperty('defaultValue') && defaultValue !== '') {
        // defaultValue can be an array of indexes, a single index Number, an array of labels or a single label String
        if (dualValueFields.includes(type)) {
          if (!Array.isArray(defaultValue)) { // if defaultValue is not an array, turn it into one
            value = [defaultValue]
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
      // Otherwise set a null state default value, except for array field values
      } else if (!scaffold.hasOwnProperty('parentModelKey')) {
        value = this.getNullStateValue()
      }
      return value
    },
    async updateValue (value) {
      const field = CloneDeep(this.field)
      field.value = value
      const check = await useValidateField(field)
      field.state = check.state
      field.originalState = check.state
      field.validation = check.validation
      field.originalValidation = check.originalValidation
      await this.setField(field)
      this.$nuxt.$emit('fieldValueUpdated', this.field)
    },
    initializeReactions (field) {
      const react = this.react
      if (!react) { return }
      const len = react.length
      for (let i = 0; i < len; i++) {
        const reaction = react[i]
        if (reaction.modelKey === field.id) {
          const field = CloneDeep(this.field)
          field.value = this[reaction.func](...Object.values(reaction.args))
          this.setField(field)
        }
      }
    },
    async detectConditions () {
      const conditions = this.conditions
      if (!conditions) { return }
      const dualValueFields = ['select', 'radio', 'checkbox']
      const len = conditions.length
      let displayField = [true]
      for (let i = 0; i < len; i++) {
        const condition = conditions[i]
        const eq = `${condition.eq}`
        const neq = `${condition.neq}`
        const field = await this.$field.get(condition.modelKey)
        const type = field.scaffold.type
        let value = `${field.value}`
        if (dualValueFields.includes(type)) {
          value = value[0]
        }
        if (eq) {
          displayField.push(value === eq)
        } else if (neq) {
          displayField.push(value !== neq)
        }
      }
      displayField = displayField.every((val) => {
        return val === true
      })
      if (displayField !== this.field.validate) {
        this.setField(Object.assign(CloneDeep(this.field), {
          validate: displayField
        }))
      }
      this.displayField = displayField
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.field {

}
</style>
