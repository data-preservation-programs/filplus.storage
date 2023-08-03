// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  fields: [],
  savedFormExists: false
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  fields: state => state.fields,
  savedFormExists: state => state.savedFormExists
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // ////////////////////////////////////////////////////////////////// setField
  async setField ({ commit, getters }, payload) {
    const index = getters.fields.findIndex(field => field.id === payload.id)
    await commit('SET_FIELD', { index, field: payload })
  },
  // /////////////////////////////////////////////////////////////// removeField
  removeField ({ commit, getters }, id) {
    const index = getters.fields.findIndex(field => field.id === id)
    commit('REMOVE_FIELD', index)
  },
  // ////////////////////////////////////////////////// setSavedFormExistsStatus
  setSavedFormExistsStatus ({ commit }, status) {
    commit('SET_SAVED_FORM_EXISTS_STATUS', status)
  }
  // ////////////////////////////////////////////////////////// restoreSavedForm
  // restoreSavedForm ({ commit, getters, dispatch }, formId) {
  //   const id = `form__${formId}`
  //   const fields = JSON.parse(this.$ls.get(id))
  //   fields.forEach((field) => {
  //     commit('SET_FIELD', {
  //       index: getters.fields.findIndex(obj => obj.id === field.id),
  //       field
  //     })
  //   })
  //   this.$ls.remove(id)
  //   dispatch('setSavedFormExistsStatus', false)
  // }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_FIELD (state, payload) {
    const index = payload.index
    const field = payload.field
    index === -1 ? state.fields.push(field) : state.fields.splice(index, 1, field)
  },
  REMOVE_FIELD (state, index) {
    state.fields.splice(index, 1)
  }
  // SET_SAVED_FORM_EXISTS_STATUS (state, status) {
  //   state.savedFormExists = status
  // }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  state,
  getters,
  actions,
  mutations
}
