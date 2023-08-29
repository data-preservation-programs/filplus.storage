// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  fields: [],
  models: [],
  formSaveStates: []
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  fields: state => state.fields,
  models: state => state.models,
  formSaveStates: state => state.formSaveStates
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // ///////////////////////////////////////////////////////////// registerModel
  async registerModel ({ commit, getters }, payload) {
    const index = getters.models.findIndex(model => model.id === payload.id)
    await commit('REGISTER_MODEL', { index, model: payload })
  },
  // ////////////////////////////////////////////////////////////////// setField
  async setField ({ commit, getters }, incoming) {
    const field = CloneDeep(getters.fields.find(field => field.id === incoming.id))
    if (field) {
      Object.assign(field, incoming)
    }
    const index = getters.fields.findIndex(field => field.id === incoming.id)
    await commit('SET_FIELD', { index, field: field || incoming })
  },
  // /////////////////////////////////////////////////////////////// removeField
  removeField ({ commit, getters }, id) {
    const index = getters.fields.findIndex(field => field.id === id)
    commit('REMOVE_FIELD', index)
  },
  // ////////////////////////////////////////////////////////// setFormSaveState
  setFormSaveState ({ commit, getters }, payload) {
    const index = getters.formSaveStates.findIndex(form => form.id === payload.id)
    commit('SET_FORM_SAVE_STATE', { index, form: payload })
  },
  // /////////////////////////////////////////////////////// removeFormSaveState
  removeFormSaveState ({ commit, getters }, id) {
    const index = getters.fields.findIndex(form => form.id === id)
    commit('REMOVE_FORM_SAVE_STATE', index)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  REGISTER_MODEL (state, payload) {
    const index = payload.index
    const model = payload.model
    index === -1 ? state.models.push(model) : state.models.splice(index, 1, model)
  },
  SET_FIELD (state, payload) {
    const index = payload.index
    const field = payload.field
    index === -1 ? state.fields.push(field) : state.fields.splice(index, 1, field)
    const found = state.fields.find(field => field.id === 'data_preparer_location')
    if (found) {
      console.log('🔎', found.modelKey, found.value)
    }
  },
  REMOVE_FIELD (state, index) {
    state.fields.splice(index, 1)
  },
  SET_FORM_SAVE_STATE (state, payload) {
    const index = payload.index
    const form = payload.form
    index === -1 ? state.formSaveStates.push(form) : state.formSaveStates.splice(index, 1, form)
  },
  REMOVE_FORM_SAVE_STATE (state, index) {
    state.formSaveStates.splice(index, 1)
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
