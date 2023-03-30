/*
 *
 * 🔌 [plugin | button] button
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

// ////////////////////////////////////////////////////////////// [Class] Button
// -----------------------------------------------------------------------------
const Button = (store, id) => {
  let button = store.getters['button/buttons'].find(button => button.id === id)
  return {
    // ================================================================ register
    async register () {
      if (!button) {
        this.set({
          id,
          loading: false
        })
      }
    },

    // ============================================================== deregister
    async deregister () {
      if (button) {
        await store.dispatch('button/removeButton', id)
      }
    },

    // ===================================================================== get
    get () {
      return button
    },

    // ===================================================================== set
    async set (incoming) {
      await store.dispatch('button/setButton', Object.assign(CloneDeep(button || {}), incoming))
      button = store.getters['button/buttons'].find(button => button.id === id)
    },

    // ================================================================= loading
    loading () {
      return button.loading
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ store }, inject) {
  inject('button', (id) => Button(store, id))
}
