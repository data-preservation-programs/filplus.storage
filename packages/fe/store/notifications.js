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
      console.log('========= [Store Action: notifications/getNotificationList]')
      console.log(e)
      // dispatch('setLoadingStatus', { type: 'loading', status: false })
      return false
    }
  },
  // /////////////////////////////////////////////////////// setNotificationList
  setNotificationList ({ commit }, notificationList) {
    commit('SET_NOTIFICATION_LIST', notificationList)
  },
  // /////////////////////////////////////////////////// markNotificationsAsRead
  async markNotificationsAsRead ({ commit, getters, dispatch }, notificationIds) {
    try {
      const notificationList = getters.notificationList
      const response = await this.$axiosAuth.post('/post-mark-notifications-read', notificationIds)
      const notifications = response.data.payload
      const len = notifications.length
      for (let i = 0; i < len; i++) {
        const notification = notifications[i]
        const index = notificationList.findIndex(obj => obj._id === notification._id)
        commit('UPDATE_NOTIFICATION', { index, notification })
      }
    } catch (e) {
      console.log('===== [Store Action: notifications/markNotificationsAsRead]')
      console.log(e)
    }
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
  },
  UPDATE_NOTIFICATION (state, payload) {
    state.notificationList.splice(payload.index, 1, payload.notification)
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
