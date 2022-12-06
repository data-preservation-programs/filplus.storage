/*
 *
 * 🔌 [Plugin | Form] Helpers
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// checkRequired
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
      if (fieldType === 'select' && value === -1) { state = 'error' }
    }
    resolve({ state, validation: 'required' })
  })
}

// ////////////////////////////////////////////////////////////////// checkChars
const checkChars = (fieldType, value, chars) => {
  return new Promise((resolve) => {
    const min = chars.min
    const max = chars.max
    const len = fieldType === 'wysiwyg' ? value.replace(/(<([^>]+)>)/gi, '').length : (value || '').length
    let state = 'valid'
    if (typeof value === 'string' && value.trim() !== '' && (len < min || len > max)) {
      state = 'error'
    }
    resolve({ state, validation: 'chars' })
  })
}

// //////////////////////////////////////////////////////////////// checkPattern
const checkPattern = (value, pattern) => {
  return new Promise((resolve) => {
    const regex = new RegExp(pattern)
    let state = 'valid'
    if (value !== '' && !regex.test(value)) { state = 'error' }
    resolve({ state, validation: 'pattern' })
  })
}

// ///////////////////////////////////////////////////////////////// checkMinMax
const checkMinMax = (fieldType, inputType, value, min, max) => {
  return new Promise((resolve) => {
    let state = 'valid'
    if (fieldType !== 'input' && inputType !== 'number') { resolve({ state, validation: 'chars' }) }
    if (value < min || value > max) {
      state = 'error'
    }
    resolve({ state, validation: 'minmax' })
  })
}

// ////////////////////////////////////////////////////////// validateFormFields
const validateFormFields = async (fields) => {
  try {
    const len = fields.length
    const compiled = []
    let state = 'valid'
    for (let i = 0; i < len; i++) {
      const field = fields[i]
      const type = field.type
      const value = field.value
      const inputType = field.input_type
      const required = field.required
      const pattern = field.pattern
      const chars = field.chars
      const min = field.min
      const max = field.max
      const mirror = field.mirror
      let check = { state: 'valid', validation: false }
      if (type !== 'array') {
        if (required && type !== 'array') { check = await checkRequired(type, value) }
        if (check.state === 'valid' && chars) { check = await checkChars(type, value, chars) }
        if (check.state === 'valid' && pattern) { check = await checkPattern(value, pattern) }
        if (check.state === 'valid' && (min || max)) { check = await checkMinMax(type, inputType, value, min, max) }
        if (check.state !== 'valid') {
          state = 'error'
          field.state = check.state
          field.validation = check.validation
        }
      }
      field.value = typeof field.value === 'string' ? field.value.trim() : field.value
      compiled.push(field)
    }
    return { state, fields: compiled }
  } catch (e) {
    return false
  }
}

// //////////////////////////////////////////////////////////////// compileArray
const compileArray = (arrayField, fields) => {
  return new Promise((resolve) => {
    const template = arrayField.template
    const valueScaffold = arrayField.value
    let match
    if (typeof template === 'object') { // if array of objects
      match = valueScaffold.map((group) => {
        const groupId = group.group_id
        const groupFields = group.fields
        return Object.values(groupFields).reduce((acc, fieldScaffold) => {
          const field = fields.find((obj) => {
            return obj.parent_model_key === arrayField.model_key &&
                   obj.group_id === groupId &&
                   obj.model_key === fieldScaffold.model_key
          })
          acc[fieldScaffold.model_key] = field.value
          return acc
        }, {})
      })
    }
    resolve(match)
  })
}

// //////////////////////////////////////////////////////////// reconcileMirrors
const reconcileMirrors = (fields) => {
  return new Promise((resolve) => {
    const compiled = {}
    const len = fields.length
    for (let i = 0; i < len; i++) {
      const field = fields[i]
      const mirror = field.mirror
      if (!mirror || mirror.primary) {
        compiled[field.field_key] = field
      }
    }
    resolve(compiled)
  })
}

// ////////////////////////////////////////////////////// writeFieldsToFormModel
const writeFieldsToFormModel = async (model, fields) => {
  try {
    const reconciledMirrorFields = await reconcileMirrors(fields)
    const len = fields.length
    for (let i = 0; i < len; i++) {
      let field = fields[i]
      const fieldKey = field.field_key
      field = reconciledMirrorFields.hasOwnProperty(fieldKey) ? reconciledMirrorFields[fieldKey] : field
      const modelKey = field.model_key
      const mirror = field.mirror
      field.state = 'valid'
      field.validation = false
      field.originalValue = field.value
      if (!field.hasOwnProperty('parent_model_key') && (!mirror || mirror.primary)) {
        if (field.type === 'array') {
          model[modelKey] = await compileArray(field, fields)
        } else if (field.type === 'select' && field.output === 'option') {
          model[modelKey] = field.options[field.value].label
        } else {
          model[modelKey] = field.value
        }
      }
    }
    return model
  } catch (e) {
    console.log('========================== [Function: writeFieldsToFormModel]')
    throw e
  }
}

// ////////////////////////////////////////////////////////////// stripFormModel
const stripFormModel = (model, fields) => {
  return new Promise((resolve) => {
    const len = fields.length
    const compiled = {
      ...model._id && { _id: model._id }
    }
    for (let i = 0; i < len; i++) {
      const field = fields[i]
      if (!field.hasOwnProperty('parent_model_key')) {
        const modelKey = field.model_key
        compiled[modelKey] = model[modelKey]
      }
    }
    resolve(compiled)
  })
}

// //////////////////////////////////////////////////////////////// applyMirrors
const applyMirrors = (app, store, fieldToMirror) => {
  return new Promise((resolve) => {
    const compiled = []
    const fields = store.getters['form/fields']
    const mirrored = fields.filter((field) => {
      return field.mirror &&
             field.formId === fieldToMirror.formId &&
             field.model_key === fieldToMirror.model_key &&
             field.mirror.field_key === fieldToMirror.field_key &&
             field.id !== fieldToMirror.id
    })
    const len = mirrored.length
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        const field = CloneDeep(mirrored[i])
        const transform = field.transform
        compiled.push(Object.assign(field, {
          value: app.$applyTransformation(fieldToMirror.value, field.transform),
          state: fieldToMirror.state,
          validation: fieldToMirror.validation
        }))
      }
    }
    resolve(compiled)
  })
}

// ////////////////////////////////////////////////////////////// applyReactions
const applyReactions = (app, store, fieldToReactTo) => {
  return new Promise((resolve) => {
    const compiled = []
    const fields = store.getters['form/fields']
    const reacted = fields.filter((field) => {
      return field.react &&
             field.formId === fieldToReactTo.formId &&
             field.react.field_key === fieldToReactTo.field_key &&
             field.id !== fieldToReactTo.id
    })
    const len = reacted.length
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        const field = CloneDeep(reacted[i])
        const react = field.react
        compiled.push(Object.assign(field, {
          value: app.$applyReaction(fieldToReactTo.value, field.react),
          state: fieldToReactTo.state,
          validation: fieldToReactTo.validation
        }))
      }
    }
    resolve(compiled)
  })
}

// ///////////////////////////////////////////////////////// applyTransformation
const applyTransformation = (app, value, transform) => {
  return transform ? app[transform.func](app, value, transform.args) : value
}

// /////////////////////////////////////////////////////////////// applyReaction
const applyReaction = (app, value, react) => {
  return react ? app[react.func](app, value, react.args) : value
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ app, store }, inject) => {
  inject('validateFormFields', validateFormFields)
  inject('writeFieldsToFormModel', writeFieldsToFormModel)
  inject('stripFormModel', stripFormModel)
  inject('applyMirrors', fieldToMirror => applyMirrors(app, store, fieldToMirror))
  inject('applyReactions', (transform, value) => applyReactions(app, store, transform, value))
  inject('applyTransformation', (value, transform) => applyTransformation(app, value, transform))
  inject('applyReaction', (value, react) => applyTransformation(app, value, react))
}
