// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  buttons: []
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  buttons: state => state.buttons
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // ///////////////////////////////////////////////////////////////// setButton
  setButton ({ commit, getters }, payload) {
    const index = getters.buttons.findIndex(button => button.id === payload.id)
    commit('SET_BUTTON', { index, button: payload })
  },
  // ////////////////////////////////////////////////////////////// removeButton
  removeButton ({ commit, getters }, id) {
    const index = getters.buttons.findIndex(button => button.id === id)
    commit('REMOVE_BUTTON', index)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_BUTTON (state, payload) {
    const index = payload.index
    const button = payload.button
    index === -1 ? state.buttons.push(button) : state.buttons.splice(index, 1, button)
  },
  REMOVE_BUTTON (state, index) {
    state.buttons.splice(index, 1)
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  state,
  getters,
  actions,
  mutations
}
