// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// =============================================================== checkRequired
const checkRequired = (field) => {
  return new Promise((resolve) => {
    const scaffold = field.scaffold
    const fieldType = scaffold.type
    const value = field.value
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
const checkChars = (field) => {
  return new Promise((resolve) => {
    const scaffold = field.scaffold
    const value = field.value
    const chars = scaffold.chars
    const min = chars.min
    const max = chars.max
    const len = scaffold.type === 'wysiwyg' ? value.replace(/(<([^>]+)>)/gi, '').length : (value || '').length
    let state = 'valid'
    if (typeof value === 'string' && value.trim() !== '' && (len < min || len > max)) {
      state = 'error'
    }
    resolve({ state, validation: state === 'error' ? 'chars' : false })
  })
}

// ================================================================ checkPattern
const checkPattern = (field) => {
  return new Promise((resolve) => {
    const pattern = field.scaffold.pattern
    const value = field.value
    const regex = new RegExp(pattern)
    let state = 'valid'
    if (value !== '' && !regex.test(value)) { state = 'error' }
    resolve({ state, validation: state === 'error' ? 'pattern' : false })
  })
}

// ================================================================= checkMinMax
const checkMinMax = (field) => {
  return new Promise((resolve) => {
    const scaffold = field.scaffold
    const value = field.value
    let state = 'valid'
    if (scaffold.type !== 'input' && scaffold.inputType !== 'number') { resolve({ state, validation: false }) }
    if (value < scaffold.min || value > scaffold.max) {
      state = 'error'
    }
    resolve({ state, validation: state === 'error' ? 'minmax' : false })
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default (field) => {
  const scaffold = field.scaffold
  const required = scaffold.required
  let check = { state: 'valid', validation: false } // validation === 'required', 'chars', 'pattern', 'minmax'
  if (field.validate && field.type !== 'array') {
    if (required) { check = checkRequired(field) }
    if (check.state === 'valid' && scaffold.chars) { check = checkChars(field) }
    if (check.state === 'valid' && scaffold.pattern) { check = checkPattern(field) }
    if (check.state === 'valid' && (scaffold.min || scaffold.max)) { check = checkMinMax(field) }
    if (check.state === 'valid') {
      check.state = JSON.stringify(field.value) !== JSON.stringify(field.originalValue) ? 'caution' : 'valid'
    }
  }
  return check
}
