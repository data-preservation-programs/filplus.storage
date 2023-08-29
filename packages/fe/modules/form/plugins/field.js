/*
 *
 * 🔌 [plugin | field] form
 *
 */

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const Field = (app, store) => {
  return {
    // ===================================================================== get
    get (fieldId) {
      return store.getters['form/fields'].find(field => field.id === fieldId)
    },
    // ================================================= saveFieldToLocalStorage
    async saveFieldToLocalStorage (field) {
      const formId = field.formId
      const modelKey = field.modelKey
      const value = field.value
      store.dispatch('form/setFormSaveState', { id: formId, state: 'saving' })
      const form = JSON.parse(app.$ls.get(`form__${formId}`)) || { [modelKey]: field }
      if (form) {
        form[modelKey] = field
      }
      app.$ls.set(`form__${formId}`, JSON.stringify(form))
      await app.$delay(1000)
      const formStats = app.$form.getFieldStats(formId)
      const state = formStats.completed === formStats.count ? 'completed' : 'saved'
      store.dispatch('form/setFormSaveState', { id: formId, state })
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ app, store }, inject) {
  inject('field', Field(app, store))
}
