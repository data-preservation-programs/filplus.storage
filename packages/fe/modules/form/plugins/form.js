/*
 *
 * 🔌 [plugin | form] form
 *
 */

import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const Form = (app, store) => {
  return {
    // ================================================================ validate
    validate (formId) {
      const fields = store.getters['form/fields'].filter(field => field.formId === formId)
      const len = fields.length
      let formValid = true
      for (let i = 0; i < len; i++) {
        const field = fields[i]
        if (field.validate && field.mounted && (field.state === 'error' || field.originalState === 'error')) {
          formValid = false
          store.dispatch('form/setField', Object.assign({
            id: field.id,
            state: 'error',
            originalState: 'error',
            validation: field.originalValidation
          }))
        }
      }
      return formValid
    },
    // ===================================================================== get
    applyFormToSchema (formId, incoming, clearLocalStorage) {
      const schema = CloneDeep(incoming)
      const fields = store.getters['form/fields']
      const len = fields.length
      const dualValueFields = ['select', 'radio', 'checkbox'] // fields that can contain both a String and a Number (index) as the value/defaultValue
      for (let i = 0; i < len; i++) {
        const field = fields[i]
        const modelKey = field.modelKey
        const scaffold = field.scaffold
        const isSingleOption = scaffold.isSingleOption
        const options = scaffold.options
        const mirror = scaffold.mirror
        const type = scaffold.type
        let value = field.value
        if (!field.hasOwnProperty('parentModelKey') && field.validate) {
          if (dualValueFields.includes(type)) {
            // If output is NOT the index, but the string value of the option associated with the selected index
            if (typeof value !== 'string' && scaffold.output === 'option') {
              const converted = []
              let option
              if (Array.isArray(value)) {
                value.forEach((index) => {
                  const option = options[index]
                  if (option) {
                    converted.push(option.label)
                  }
                })
              } else {
                option = options[value]
              }
              if (converted.length > 0) {
                value = converted.join(', ')
              } else if (option) {
                value = option.label
              } else {
                value = scaffold.baseValue
                if (!value) { throw new Error(`baseValue key missing from ${field.modelKey} field scaffold`) }
              }
            // If output is truthy
            } else if ((type === 'radio' || type === 'checkbox') && scaffold.isSingleSelection) {
              value = value === -1 ? false : true
            }
          }
        } else if (!field.validate) {
          value = null
        }
        schema[modelKey] = value
      }
      if (clearLocalStorage) {
        app.$ls.remove(`form__${formId}`)
      }
      return schema
    },
    // =========================================================== getFieldStats
    getFieldStats (formId) {
      const fields = store.getters['form/fields']
      const len = fields.length
      const stats = {
        total: 0,
        mounted: 0,
        'not-started': 0,
        'in-progress': 0,
        completed: 0,
        error: 0
      }
      for (let i = 0; i < len; i++) {
        const field = fields[i]
        stats.total++
        if (field.formId === formId && field.displayField && field.mounted && field.scaffold.required) {
          stats.mounted++
          field.state === 'not-started' ? stats['not-started']++
            : field.state === 'in-progress' ? stats['in-progress']++
              : field.state === 'completed' ? stats.completed++
                : stats.error++
        }
      }
      return stats
    },
    // =========================================================== getSavedState
    getSavedState (formId) {
      const formSaveStates = store.getters['form/formSaveStates']
      const form = formSaveStates.find(form => form.id === formId)
      return form ? form.state : false
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ app, store }, inject) {
  inject('form', Form(app, store))
}
