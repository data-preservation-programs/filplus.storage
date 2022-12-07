// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

import GeneralSiteData from '@/content/pages/general.json'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  siteContent: {},
  staticFiles: {},
  clipboard: false,
  application: {
    application_name: '',
    organization_name: '',
    organization_website: '',
    organization_social_media_handle: '',
    organization_social_media_handle_type: '',
    total_datacap_size: 0,
    total_datacap_size_unit: '',
    weekly_data_size: 0,
    weekly_data_size_unit: '',
    filecoin_address: '',
    about: '',
    funding_sources: '',
    ecosystem_associates: '',
    nature_of_data: '',
    source_of_data: '',
    data_sample: '',
    frequency_of_retrieval: '',
    duration_of_storage: '',
    geographic_distribution: '',
    sending_data: '',
    storage_provider_selection_plan: '',
    replication_plan: '',
    immediacy: '',
    notary: '',
    region: ''
  },
  networkStorageCapacity: false
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  siteContent: state => state.siteContent,
  staticFiles: state => state.staticFiles,
  clipboard: state => state.clipboard,
  application: state => state.application,
  networkStorageCapacity: state => state.networkStorageCapacity
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
  async getNetworkStorageCapacity ({ commit }) {
    try {
      const token = this.$config.spacescopeToken
      const date = this.$moment.tz('UTC').subtract(1, 'days').format('YYYY-MM-DD')
      const response = await this.$axios.get(`https://api.spacescope.io/v2/power/network_storage_capacity?end_date=${date}&start_date=${date}`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      if (response.status === 200) {
        const value = this.$formatBytes(response.data.data[0].total_raw_bytes_power)
        commit('SET_NETWORK_STORAGE_CAPACITY', value)
      }
    } catch (e) {
      console.log('========= [Store Action: general/getNetworkStorageCapacity]')
      console.log(e)
    }
  },
  // ///////////////////////////////////////////////////////// updateApplication
  updateApplication ({ commit, getters }, incoming) {
    let application = CloneDeep(getters.application)
    application = Object.assign(application, incoming)
    commit('SET_APPLICATION', application)
  },
  // ////////////////////////////////////////////////// submitGeneralApplication
  async submitGeneralApplication ({ commit }, application) {
    try {
      const response = await this.$axiosAuth.post('/submit-general-application', application)
      console.log(response.data.payload)
    } catch (e) {
      console.log('========== [Store Action: general/submitGeneralApplication]')
      console.log(e)
      return false
    }
  },
  // //////////////////////////////////////////////////// submitLargeApplication
  async submitLargeApplication ({ commit }, application) {
    try {
      const response = await this.$axiosAuth.post('/submit-large-application', application)
      console.log(response.data.payload)
    } catch (e) {
      console.log('============ [Store Action: general/submitLargeApplication]')
      console.log(e)
      return false
    }
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
  SET_APPLICATION (state, application) {
    state.application = application
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
