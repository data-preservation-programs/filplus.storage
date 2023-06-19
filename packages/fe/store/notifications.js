// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
// import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  notificationList: null,
  loading: true,
  metadata: {
    page: 1,
    limit: 10,
    totalPages: 1
  }
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  notificationList: state => state.notificationList,
  loading: state => state.loading
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // /////////////////////////////////////////////////////// getNotificationList
  async getNotificationList ({ commit, getters, dispatch }) {
    try {
      const params = getters.metadata
      const response = await this.$axiosAuth.get('/get-notifications-list', { params })
      const payload = response.data.payload
      const notificationList = payload.results
      dispatch('setNotificationList', {
        notificationList: notificationList.length > 0 ? notificationList : null,
        metadata: payload.metadata
      })
    } catch (e) {
      console.log('=============== [Store Action: account/getNotificationList]')
      console.log(e)
      // dispatch('setLoadingStatus', { type: 'loading', status: false })
      return false
    }
  },
  // /////////////////////////////////////////////////////// setNotificationList
  setNotificationList ({ commit }, notificationList) {
    commit('SET_NOTIFICATION_LIST', notificationList)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_NOTIFICATION_LIST (state, payload) {
    state.notificationList = payload.notificationList
    const metadata = payload.metadata
    if (metadata) {
      state.metadata.totalPages = metadata.totalPages
      state.metadata.page = metadata.page
    }
    console.log(state.notificationList)
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
