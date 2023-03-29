// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

import GeneralSiteData from '@/content/pages/general.json'

// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  siteContent: {},
  staticFiles: {},
  clipboard: false,
  networkStorageCapacity: false,
  applyFormHighlighted: false
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  siteContent: state => state.siteContent,
  staticFiles: state => state.staticFiles,
  clipboard: state => state.clipboard,
  networkStorageCapacity: state => state.networkStorageCapacity,
  applyFormHighlighted: state => state.applyFormHighlighted
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // /////////////////////////////////////////////////////////////// getBaseData
  getBaseData ({ commit, dispatch }, payload) {
    const key = typeof payload === 'string' ? payload : payload.key
    let data = false
    switch (key) {
      case 'general': data = GeneralSiteData; break
      default : data = payload.data; break
    }
    if (data) {
      dispatch('setSiteContent', { key, data })
    }
  },
  // //////////////////////////////////////////////////////////// setSiteContent
  setSiteContent ({ commit }, payload) {
    commit('SET_SITE_CONTENT', payload)
  },
  // ///////////////////////////////////////////////////////////// getStaticFile
  async getStaticFile ({ commit, dispatch }, path) {
    try {
      const response = await this.$axiosAuth.get('/get-static-file', {
        params: { path }
      })
      const file = response.data.payload
      dispatch('setStaticFile', { path, file })
      return file
    } catch (e) {
      console.log('===================== [Store Action: general/getStaticFile]')
      console.log(e)
      dispatch('setStaticFile', { path, file: false })
      return false
    }
  },
  // ///////////////////////////////////////////////////////////// getCachedFile
  async getCachedFile ({ commit, dispatch }, path) {
    try {
      const response = await this.$axiosAuth.get('/get-cached-file', {
        params: { path }
      })
      const file = response.data.payload
      dispatch('setStaticFile', { path, file })
      return file
    } catch (e) {
      console.log('===================== [Store Action: general/getCachedFile]')
      console.log(e)
      dispatch('setStaticFile', { path, file: false })
      return false
    }
  },
  // ///////////////////////////////////////////////////////////// setStaticFile
  setStaticFile ({ commit, getters }, payload) {
    const staticFiles = CloneDeep(getters.staticFiles)
    const file = payload.file
    const path = payload.path
    !file ? delete staticFiles[path] : staticFiles[path] = file
    commit('SET_STATIC_FILE', staticFiles)
  },
  // ////////////////////////////////////////////////////////////// setClipboard
  setClipboard ({ commit }, text) {
    this.$addTextToClipboard(text)
    commit('SET_CLIPBOARD', text)
  },
  // ///////////////////////////////////////////////// getNetworkStorageCapacity
  async getNetworkStorageCapacity ({ commit, dispatch }) {
    try {
      const file = await dispatch('getCachedFile', 'network-storage-capacity.json')
      commit('SET_NETWORK_STORAGE_CAPACITY', this.$formatBytes(file[0].total_raw_bytes_power))
    } catch (e) {
      console.log('========= [Store Action: general/getNetworkStorageCapacity]')
      console.log(e)
    }
  },
  // ///////////////////////////////////////////// setApplyFormHighlightedStatus
  setApplyFormHighlightedStatus ({ commit }, status) {
    commit('SET_APPLY_FORM_HIGHLIGHTED_STATUS', status)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_SITE_CONTENT (state, payload) {
    state.siteContent[payload.key] = payload.data
  },
  SET_STATIC_FILE (state, staticFiles) {
    state.staticFiles = staticFiles
  },
  SET_CLIPBOARD (state, text) {
    state.clipboard = text
  },
  SET_NETWORK_STORAGE_CAPACITY (state, capacity) {
    state.networkStorageCapacity = capacity
  },
  SET_APPLY_FORM_HIGHLIGHTED_STATUS (state, status) {
    state.applyFormHighlighted = status
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
