// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

import GeneralSiteData from '@/content/pages/general.json'

// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  siteContent: {},
  staticFiles: {},
  generalApplicationList: {},
  largeApplicationList: {},
  clipboard: false,
  application: {
    organization_name: null,
    data_owner_region: null,
    data_owner_industry: null,
    organization_website: null,
    organization_social_media_handle: null,
    organization_social_media_handle_type: null,
    total_datacap_size: null,
    total_datacap_size_unit: null,
    weekly_data_size: null,
    weekly_data_size_unit: null,
    filecoin_address: null,
    custom_multisig: null,
    identifier: null,
    about: null,
    source_of_data_select: null,
    ecosystem_associates_textarea: null,
    nature_of_data: null,
    source_of_data_radio: null,
    source_of_data_textarea: null,
    data_preparation_plan_select: null,
    data_preparation_plan_textarea: null,
    data_sample: null,
    frequency_of_retrieval: null,
    duration_of_storage: null,
    geographic_distribution: null,
    sending_data: null,
    storage_provider_selection_plan_select: null,
    storage_provider_selection_plan_input: null,
    storage_provider_selection_plan_textarea: null,
    replication_plan_select: null,
    replication_plan_textarea: null,
    notary: null,
    ga_region: null,
    public_availability_radio: null,
    public_availability_textarea: null,
    confirm_follow_fil_guideline: null
  },
  networkStorageCapacity: false,
  applyFormHighlighted: false,
  githubIssue: false
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  siteContent: state => state.siteContent,
  staticFiles: state => state.staticFiles,
  clipboard: state => state.clipboard,
  application: state => state.application,
  networkStorageCapacity: state => state.networkStorageCapacity,
  applyFormHighlighted: state => state.applyFormHighlighted,
  githubIssue: state => state.githubIssue,
  generalApplicationList: state => state.generalApplicationList,
  largeApplicationList: state => state.largeApplicationList
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
  // ////////////////////////////////////////////////// submitGeneralApplication
  async submitGeneralApplication ({ commit, dispatch }, application) {
    try {
      this.$gtm.push({ event: 'submission_ga' })
      const response = await this.$axiosAuth.post('/submit-general-application', application)
      await dispatch('setGithubIssue', response.data.payload)
      this.dispatch('button/removeLoader', 'ga-submit-button')
      this.$toaster.add({
        type: 'toast',
        category: 'success',
        message: 'General Application submitted successfully'
      })
      this.$gtm.push({ event: 'success_ga' })
    } catch (e) {
      console.log('========== [Store Action: general/submitGeneralApplication]')
      console.log(e)
      this.dispatch('button/removeLoader', 'ga-submit-button')
      this.$toaster.add({
        type: 'toast',
        category: 'error',
        message: 'Something went wrong. Please refresh the page and try again.'
      })
      return false
    }
  },
  // //////////////////////////////////////////////////// submitLargeApplication
  async submitLargeApplication ({ commit, dispatch }, application) {
    try {
      this.$gtm.push({ event: 'submission_lda' })
      const response = await this.$axiosAuth.post('/submit-large-application', application)
      await dispatch('setGithubIssue', response.data.payload)
      this.dispatch('button/removeLoader', 'lda-submit-button')
      this.$toaster.add({
        type: 'toast',
        category: 'success',
        message: 'Large Dataset Application submitted successfully'
      })
      this.$gtm.push({ event: 'success_lda' })
    } catch (e) {
      console.log('============ [Store Action: general/submitLargeApplication]')
      console.log(e)
      this.dispatch('button/removeLoader', 'lda-submit-button')
      this.$toaster.add({
        type: 'toast',
        category: 'error',
        message: 'Something went wrong. Please refresh the page and try again.'
      })
      return false
    }
  },
  // ///////////////////////////////////////////// setApplyFormHighlightedStatus
  setApplyFormHighlightedStatus ({ commit }, status) {
    commit('SET_APPLY_FORM_HIGHLIGHTED_STATUS', status)
  },
  // //////////////////////////////////////////////////////////// setGithubIssue
  setGithubIssue ({ commit }, issue) {
    commit('SET_GITHUB_ISSUE', issue)
  },
  // ///////////////////////////////////////////////// setGeneralApplicationList
  setGeneralApplicationList ({ commit }, applications) {
    commit('SET_GENERAL_APPLICATION_LIST', applications)
  },
  // ///////////////////////////////////////////////// getGeneralApplicationList
  async getGeneralApplicationList ({ commit, dispatch }) {
    try {
      const response = await this.$axiosAuth.get('/get-general-application-list')
      const applications = response.data.payload
      dispatch('setGeneralApplicationList', applications)
      return applications
    } catch (e) {
      console.log('=== [Store Action: general/getGeneralApplicationList]')
      console.log(e)
      dispatch('setGeneralApplicationList', { application: false })
      return false
    }
  },
  // /////////////////////////////////////////////////// setLargeApplicationList
  setLargeApplicationList ({ commit }, applications) {
    commit('SET_LARGE_APPLICATION_LIST', applications)
  },
  // /////////////////////////////////////////////////// getLargeApplicationList
  async getLargeApplicationList ({ commit, dispatch }) {
    try {
      const response = await this.$axiosAuth.get('/get-large-application-list')
      const applications = response.data.payload
      dispatch('setLargeApplicationList', applications)
      return applications
    } catch (e) {
      console.log('=== [Store Action: general/getLargeApplicationList]')
      console.log(e)
      dispatch('setLargeApplicationList', { application: false })
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
  },
  SET_APPLY_FORM_HIGHLIGHTED_STATUS (state, status) {
    state.applyFormHighlighted = status
  },
  SET_GITHUB_ISSUE (state, issue) {
    state.githubIssue = issue
  },
  SET_GENERAL_APPLICATION_LIST (state, applications) {
    state.generalApplicationList = applications
  },
  SET_LARGE_APPLICATION_LIST (state, applications) {
    state.largeApplicationList = applications
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
