// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  applicationList: false,
  loading: false,
  refresh: false,
  metadata: {
    page: 1,
    limit: 10,
    totalPages: 1
  },
  openCount: {
    ldn: false, // cannot be 'lda'
    ga: false
  },
  application: {
    // Hubspot
    hubspot_opt_in_email: null,
    hubspot_opt_in_first_name: null,
    hubspot_opt_in_last_name: null,
    // LDA & GA
    data_owner_name: null,
    website: null,
    social_media_handle: null,
    social_media_handle_type: null,
    total_datacap_size_range: null,
    total_datacap_size_input: null,
    total_datacap_size_unit: null,
    filecoin_address: null,
    // GA
    notary: null,
    ga_region: null,
    // LDA
    your_role: null,
    data_owner_region: null,
    data_owner_industry: null,
    total_size_of_single_dataset_one_copy: null,
    total_size_of_single_dataset_one_copy_unit: null,
    number_of_replicas: null,
    weekly_data_size: null,
    weekly_data_size_unit: null,
    application_data_type: null,
    project_details: null,
    ecosystem_associates_radio: null,
    ecosystem_associates_textarea: null,
    nature_of_data: null,
    source_of_data_select: null,
    source_of_data_textarea: null,
    data_preparer_location: null,
    data_preparer_preparation_plan: null,
    general_preparation_plan: null,
    data_stored_before_radio: null,
    dataset_stored_before_textarea: null,
    data_sample: null,
    public_availability_radio: null,
    public_availability_textarea: null,
    frequency_of_retrieval: null,
    duration_of_storage: null,
    geographic_distribution: null,
    data_distribution: null,
    storage_provider_selection_plan_select: null,
    storage_provider_selection_plan_input: null,
    storage_provider_selection_plan_textarea: null,
    replication_plan_select: null,
    replication_plan_textarea: null,
    confirm_follow_fil_guideline: null,
    custom_multisig: null, // these are populated on the backend, not used in the form
    identifier: null // these are populated on the backend, not used in the form
  },
  applyFormHighlighted: false,
  githubIssue: false,
  view: 'lda' // 'ga' or 'lda'
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  application: state => state.application,
  githubIssue: state => state.githubIssue,
  applicationList: state => state.applicationList,
  loading: state => state.loading,
  refresh: state => state.refresh,
  metadata: state => state.metadata,
  view: state => state.view,
  openCount: state => state.openCount
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // ///////////////////////////////////////////////////////// submitApplication
  async submitApplication ({ commit, dispatch }, payload) {
    const application = payload.application
    const bytes = payload.bytes
    const thresholds = payload.thresholds
    const tib1 = thresholds.tib_1
    const tib100 = thresholds.tib_100
    const pib5 = thresholds.pib_5
    const pib15 = thresholds.pib_15
    const requestedAmount = `${application.total_datacap_size_input} ${application.total_datacap_size_unit}`
    let stage
    let labels = ['source:filplus.storage']
    const assignees = []
    const comments = []
    if (bytes >= tib1 && bytes < tib100) {
      stage = 'stage-ga'
      labels.push('state:Verifying')
    } else if (bytes >= tib100 && bytes <= pib5) {
      stage = 'stage-lda'
    } else if (bytes > pib5 && bytes <= pib15) {
      stage = 'stage-vlda'
      labels.push('very large application')
      comments.push(`This application requests a total of ${requestedAmount}, so it’s labeled \`very large application\``)
    } else if (bytes > pib15) {
      stage = 'stage-efilplus'
      labels = labels.concat(['very large application', 'efil+'])
      assignees.push('kevzak')
      comments.push(`This application requests a total of ${requestedAmount}, so it’s labeled \`efil+\``)
    }
    if (application.public_availability_radio === 'No') {
      if (!labels.includes('efil+')) { labels.push('efil+') }
      if (!assignees.includes('kevzak')) { assignees.push('kevzak') }
      comments.push('This application is requesting DataCap for a **private** dataset, so it\'s labeled `efil+`')
    }
    try {
      this.$gtm.push({ event: `submission_${stage}` })
      const response = await this.$axiosAuth.post('/submit-application', {
        application,
        labels,
        assignees,
        comments
      }, {
        params: { stage }
      })
      await dispatch('setGithubIssue', response.data.payload)
      await this.dispatch('auth/getAccount', this.getters['auth/account']._id)
      this.$button('application-submit-button').set({ loading: false })
      this.$toaster.add({
        type: 'toast',
        category: 'success',
        message: 'Application submitted successfully'
      })
      this.$gtm.push({ event: `success_${stage}` })
      this.$router.push('/apply/success')
    } catch (e) {
      console.log('================= [Store Action: account/submitApplication]')
      console.log(e)
      console.log(e.response)
      this.$button('application-submit-button').set({ loading: false })
      this.$toaster.add({
        type: 'toast',
        category: 'error',
        message: e.response.data.message || 'Something went wrong. Please refresh the page and try again.'
      })
    }
  },
  // //////////////////////////////////////////////////////////// setGithubIssue
  setGithubIssue ({ commit }, issue) {
    commit('SET_GITHUB_ISSUE', issue)
  },
  // //////////////////////////////////////////////////////// getApplicationList
  async getApplicationList ({ commit, getters, dispatch }, metadata) {
    try {
      const { params } = await this.$exportSearchAndFiltersFromQuery([
        { filterKey: 'page', default: 1 },
        { filterKey: 'limit' },
        { filterKey: 'sort' },
        { filterKey: 'state' },
        { filterKey: 'view', default: getters.view }
      ])
      const response = await this.$axiosAuth.get('/get-application-list', { params })
      const payload = response.data.payload
      const applicationList = payload.results
      dispatch('setApplicationList', {
        applicationList: applicationList.length > 0 ? applicationList : false,
        metadata: payload.metadata
      })
    } catch (e) {
      console.log('================ [Store Action: account/getApplicationList]')
      console.log(e)
      dispatch('setLoadingStatus', { type: 'loading', status: false })
      return false
    }
  },
  // /////////////////////////////////////////////////// getOpenApplicationCount
  async getOpenApplicationCount ({ commit, getters, dispatch }, view) {
    try {
      const response = await this.$axiosAuth.get('/get-open-application-count', {
        params: { view }
      })
      commit('SET_OPEN_APPLICATION_COUNT', { view, count: response.data.payload })
    } catch (e) {
      console.log('=========== [Store Action: account/getOpenApplicationCount]')
      console.log(e)
    }
  },
  // //////////////////////////////////////////////////////// setApplicationList
  setApplicationList ({ commit }, applicationList) {
    commit('SET_APPLICATION_LIST', applicationList)
  },
  // ////////////////////////////////////////////////////////// setLoadingStatus
  setLoadingStatus ({ commit }, payload) {
    commit('SET_LOADING_STATUS', payload)
  },
  // /////////////////////////////////////////////////////////////////// setView
  setView ({ commit }, view) {
    commit('SET_VIEW', view)
  },
  // /////////////////////////////////////////////////////// setHubspotOptInData
  setHubspotOptInData ({ commit, getters }, account) {
    if (!account) { return getters.application }
    const application = CloneDeep(getters.application)
    const optedIn = account.hubspotOptIn
    if (!optedIn && account.githubEmail) {
      application.hubspot_opt_in_email = account.githubEmail
    } else if (optedIn) {
      application.hubspot_opt_in_first_name = account.hubspotOptInFirstName
      application.hubspot_opt_in_last_name = account.hubspotOptInLastName
      application.hubspot_opt_in_email = account.hubspotOptInEmail
    }
    commit('SET_APPLICATION', application)
    return application
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_APPLICATION (state, application) {
    state.application = application
  },
  SET_GITHUB_ISSUE (state, issue) {
    state.githubIssue = issue
  },
  SET_APPLICATION_LIST (state, payload) {
    state.applicationList = payload.applicationList
    const metadata = payload.metadata
    if (metadata) {
      state.metadata.totalPages = metadata.totalPages
      state.metadata.page = metadata.page
    }
  },
  SET_LOADING_STATUS (state, payload) {
    state[payload.type] = payload.status
  },
  SET_VIEW (state, view) {
    state.view = view
  },
  SET_OPEN_APPLICATION_COUNT (state, payload) {
    state.openCount[payload.view === 'lda' ? 'ldn' : 'ga'] = payload.count
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
