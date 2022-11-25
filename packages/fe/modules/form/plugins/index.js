/*
 *
 * 🔌 [plugin | form] index
 *
 */

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import Store from '@/modules/form/store'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// registerStore
const registerStore = (store, next) => {
  return new Promise((next) => {
    store.registerModule('form', Object.assign({
      namespaced: true
    }, Store))
    next()
  })
  if (next) { return next() }
}

// /////////////////////////////////////////////////////////////////////// field
const field = (store) => (fieldID) => {
  return store.getters['form/fields'].find(obj => obj.id.includes(fieldID))
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function ({ app, store }, inject) {
  await registerStore(store)
  inject('field', field(store))
}
