/*
 *
 * 🔌 [plugin | form] field
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ==================================================================== getValue
const getValue = (scaffold, form) => {
  const dualValueFields = ['select', 'radio', 'checkbox']
  const type = scaffold.type
  const formKey = scaffold.formKey
  let value = form.scaffold[formKey] // First grab the value found in the form
  if (scaffold.hasOwnProperty('defaultValue')) { // If a default value is set in the field scaffold, grab that instead
    const defaultValue = scaffold.defaultValue
    value = defaultValue
    if ((dualValueFields.includes(type)) && typeof defaultValue === 'string') {
      value = scaffold.options.findIndex(option => option.label === defaultValue)
    }
  } else { // Otherwise set a default value
    switch (type) {
      case 'checkbox' : value = false; break
      case 'select' : value = -1; break
      case 'range' : value = scaffold.min; break
      default : value = ''; break
    }
  }
  return value
}

// =============================================================== checkRequired
const checkRequired = (fieldType, value) => {
  return new Promise((resolve) => {
    const type = typeof value
    let state = 'valid'
    if (type === 'string' || type === 'boolean') {
      if (value === '' || !value) { state = 'error' }
    } else if (Array.isArray(value)) {
      if (value.length === 0) { state = 'error' }
    } else if (type === 'object' && !Array.isArray(value)) {
      if (Object.keys(value).length === 0) { state = 'error' }
    } else if (type === 'number') {
      if ((fieldType === 'select' || fieldType === 'checkbox' || fieldType === 'radio') && value === -1) {
        state = 'error'
      }
    }
    resolve({ state, validation: state === 'error' ? 'required' : false })
  })
}

// ================================================================== checkChars
const checkChars = (fieldType, value, chars) => {
  return new Promise((resolve) => {
    const min = chars.min
    const max = chars.max
    const len = fieldType === 'wysiwyg' ? value.replace(/(<([^>]+)>)/gi, '').length : (value || '').length
    let state = 'valid'
    if (typeof value === 'string' && value.trim() !== '' && (len < min || len > max)) {
      state = 'error'
    }
    resolve({ state, validation: state === 'error' ? 'chars' : false })
  })
}

// ================================================================ checkPattern
const checkPattern = (value, pattern) => {
  return new Promise((resolve) => {
    const regex = new RegExp(pattern)
    let state = 'valid'
    if (value !== '' && !regex.test(value)) { state = 'error' }
    resolve({ state, validation: state === 'error' ? 'pattern' : false })
  })
}

// ================================================================= checkMinMax
const checkMinMax = (fieldType, inputType, value, min, max) => {
  return new Promise((resolve) => {
    let state = 'valid'
    if (fieldType !== 'input' && inputType !== 'number') { resolve({ state, validation: false }) }
    if (value < min || value > max) {
      state = 'error'
    }
    resolve({ state, validation: state === 'error' ? 'minmax' : false })
  })
}

// //////////////////////////////////////////////////////// applyTransformations
const applyTransformations = async (app, store, transformSourceField) => {
  try {
    const compiled = []
    const fields = store.getters['form/fields']
    const transformed = fields.filter((field) => {
      const scaffold = field.scaffold
      return (scaffold.mirror || scaffold.react) &&
             field.formId === transformSourceField.formId &&
             field.formKey === transformSourceField.formKey &&
             field.id !== transformSourceField.id
    })
    const len = transformed.length
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        const field = CloneDeep(transformed[i])
        const scaffold = field.scaffold
        const mirror = scaffold.mirror
        const react = scaffold.react
        let value
        if (mirror && mirror.fieldKey === transformSourceField.fieldKey) {
          value = applyTransformation(app, field, transformSourceField, scaffold.mirror)
          await app.$field(field.id).update({
            value,
            state: value !== field.originalValue ? 'caution' : 'valid',
            validation: transformSourceField.validation
          })
        }
        if (react && react.fieldKey === transformSourceField.fieldKey) {
          value = applyTransformation(app, field, transformSourceField, scaffold.react)
          await app.$field(field.id).update({
            value,
            state: value !== field.originalValue ? 'caution' : 'valid',
            validation: transformSourceField.validation
          })
        }
      }
    }
  } catch (e) {
    console.log('============================ [Function: applyTransformations]')
    throw e
  }
}

// ///////////////////////////////////////////////////////// applyTransformation
const applyTransformation = (app, transformField, transformSourceField, transform) => {
  return transform ? app[transform.func](app, transformField, transformSourceField, transform.args) : transformSourceField.value
}

// //////////////////////////////////////////////// updateLocalStorageSavedField
const updateLocalStorageSavedField = (ctx, formId, allFields) => {
  if (process.client) {
    ctx.$ls.set(`form__${formId}`, JSON.stringify(allFields))
  }
}

// /////////////////////////////////////////////////////////////////////// Field
// -----------------------------------------------------------------------------
const Field = (app, store, id) => {
  let field = store.getters['form/fields'].find(field => field.id === id)
  let value, scaffold, type, inputType, required, pattern, chars, min, max, mirror, react
  if (field) {
    value = field.value
    scaffold = field.scaffold
    type = scaffold.type
    inputType = scaffold.inputType
    required = scaffold.required
    pattern = scaffold.pattern
    chars = scaffold.chars
    min = scaffold.min
    max = scaffold.max
    mirror = scaffold.mirror
    react = scaffold.react
  }
  return {

    // ================================================================ register
    async register (formId, fieldKey, scaffold) {
      if (!field) {
        const form = store.getters['form/forms'].find(form => form.id === formId)
        const value = getValue(scaffold, form)
        await store.dispatch('form/setField', {
          id,
          fieldKey,
          formId,
          value,
          originalValue: value,
          state: 'valid',
          validate: true,
          validation: false,
          scaffold
        })
      }
    },

    // ===================================================================== get
    get () {
      return field
    },

    // ================================================================== remove
    remove () {
      store.dispatch('form/removeField', field.id)
    },

    // ================================================================== update
    async update (values) {
      await store.dispatch('form/setField', Object.assign(CloneDeep(field), values))
    },

    // ================================================================== update
    async updateValue (value) {
      field = CloneDeep(field)
      let parsed = value
      if ((type === 'input' && inputType === 'number') || type === 'range') {
        parsed = value !== '' ? parseFloat(value) : null
      } else if (typeof value === 'string') {
        parsed = value.trim()
      }
      field.value = parsed
      field.state = field.value !== field.originalValue ? 'caution' : 'valid'
      field.validation = false
      await store.dispatch('form/setField', field)
      await applyTransformations(app, store, field)
      updateLocalStorageSavedField(app, field.formId, store.getters['form/fields'])
    },

    // ================================================================ validate
    async validate () {
      field = CloneDeep(field)
      let state = 'valid'
      let check = { state: 'valid', validation: false }
      if (field.validate && type !== 'array') {
        if (required) { check = await checkRequired(type, value) }
        if (check.state === 'valid' && chars) { check = await checkChars(type, value, chars) }
        if (check.state === 'valid' && pattern) { check = await checkPattern(value, pattern) }
        if (check.state === 'valid' && (min || max)) { check = await checkMinMax(type, inputType, value, min, max) }
        if (check.state !== 'valid') {
          state = 'error'
          field.state = check.state
          field.validation = check.validation
        }
      }
      await store.dispatch('form/setField', field)
      return { field, check }
    }

  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ app, store, route }, inject) {
  inject('field', (id) => Field(app, store, id))
}
