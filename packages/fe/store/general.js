// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

import GeneralSiteData from '@/content/pages/general.json'

let timeout1 // used for highlighting /apply form in general/applyFormHighlighted action
let timeout2 // used for highlighting /apply form in general/applyFormHighlighted action

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  siteContent: {},
  staticFiles: {},
  clipboard: false,
  application: {
    organization_name: '',
    data_owner_region: '',
    data_owner_industry: '',
    organization_website: '',
    organization_social_media_handle: '',
    organization_social_media_handle_type: '',
    total_datacap_size: 0,
    total_datacap_size_unit: '',
    weekly_data_size: 0,
    weekly_data_size_unit: '',
    filecoin_address: '',
    custom_multisig: '',
    identifier: '',
    about: '',
    source_of_data_select: '',
    ecosystem_associates_textarea: '',
    nature_of_data: '',
    source_of_data_radio: '',
    source_of_data_textarea: '',
    data_preparation_plan_select: '',
    data_preparation_plan_textarea: '',
    data_sample: '',
    frequency_of_retrieval: '',
    duration_of_storage: '',
    geographic_distribution: '',
    sending_data: '',
    storage_provider_selection_plan_select: '',
    storage_provider_selection_plan_input: '',
    storage_provider_selection_plan_textarea: '',
    replication_plan_select: '',
    replication_plan_textarea: '',
    notary: '',
    ga_region: '',
    public_availability_radio: '',
    public_availability_textarea: '',
    confirm_follow_fil_guideline: '',
    github_handle: ''
  },
  networkStorageCapacity: false,
  applyFormHighlighted: false,
  githubIssueLink: false
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
  githubIssueLink: state => state.githubIssueLink
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
      const options = { headers: { authorization: `Bearer ${token}` } }
      const response = await this.$axios.get(`https://api.spacescope.io/v2/power/network_storage_capacity?end_date=${date}&start_date=${date}`, options)
      // data: {
      //   request_id: '0c0ca661-288d-4250-898e-142d9ed19927#301034',
      //   code: 30004,
      //   message: 'SpaceScope API data is not available.'
      // }
      if (response.data.data) {
        const value = this.$formatBytes(response.data.data[0].total_raw_bytes_power)
        commit('SET_NETWORK_STORAGE_CAPACITY', value)
      } else {
        commit('SET_NETWORK_STORAGE_CAPACITY', '15.7 EiB')
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
  async submitGeneralApplication ({ commit, dispatch }, application) {
    try {
      const response = await this.$axiosAuth.post('/submit-general-application', application)
      dispatch('setGithubIssueLink', response.data.payload)
      this.dispatch('button/removeLoader', 'ga-submit-button')
      this.$toaster.add({
        type: 'toast',
        category: 'success',
        message: 'General Application submitted successfully'
      })
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
      const response = await this.$axiosAuth.post('/submit-large-application', application)
      dispatch('setGithubIssueLink', response.data.payload)
      this.dispatch('button/removeLoader', 'lda-submit-button')
      this.$toaster.add({
        type: 'toast',
        category: 'success',
        message: 'Large Dataset Application submitted successfully'
      })
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
  // //////////////////////////////////////////////////////// highlightApplyForm
  highlightApplyForm ({ commit }, status) {
    if (timeout2) { return }
    const applyFormCard = document.getElementById('apply-form-card')
    this.$scrollToElement(applyFormCard, 250, -(window.innerHeight - applyFormCard.clientHeight) / 2)
    timeout1 = setTimeout(() => {
      commit('HIGHLIGH_APPLY_FORM', true)
      clearTimeout(timeout1)
    }, 250)
    timeout2 = setTimeout(() => {
      commit('HIGHLIGH_APPLY_FORM', false)
      const currentRoute = this.$router.history.current
      const query = Object.assign({}, currentRoute.query)
      if (query.highlight_form) {
        delete query.highlight_form
        this.$router.replace({ query })
      }
      clearTimeout(timeout2)
      timeout2 = false
    }, 2250)
  },
  // //////////////////////////////////////////////////////// setGithubIssueLink
  setGithubIssueLink ({ commit }, link) {
    commit('SET_GITHUB_ISSUE_LINK', link)
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
  HIGHLIGH_APPLY_FORM (state, status) {
    state.applyFormHighlighted = status
  },
  SET_GITHUB_ISSUE_LINK (state, link) {
    state.githubIssueLink = link
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
