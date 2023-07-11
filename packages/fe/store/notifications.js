// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  notificationList: null,
  newCount: 0,
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
  newCount: state => state.newCount,
  loading: state => state.loading,
  metadata: state => state.metadata
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // /////////////////////////////////////////////////////// getNotificationList
  async getNotificationList ({ commit, getters, dispatch }, page) {
    try {
      await dispatch('setLoadingStatus', { type: 'loading', status: true })
      await dispatch('setMetadata', { page })
      const params = getters.metadata
      const response = await this.$axiosAuth.get('/get-notification-list', { params })
      const payload = response.data.payload
      const notificationList = payload.results
      dispatch('setNotificationList', notificationList.length > 0 ? notificationList : null)
      dispatch('setMetadata', payload.metadata)
      dispatch('setLoadingStatus', { type: 'loading', status: false })
    } catch (e) {
      console.log('========= [Store Action: notifications/getNotificationList]')
      console.log(e)
      dispatch('setLoadingStatus', { type: 'loading', status: false })
      return false
    }
  },
  // /////////////////////////////////////////////////////////////// setMetadata
  setMetadata ({ commit, getters }, payload) {
    try {
      let metadata = CloneDeep(getters.metadata)
      metadata = Object.assign(metadata, payload)
      commit('SET_METADATA', metadata)
    } catch (e) {
      console.log('================= [Store Action: notifications/setMetadata]')
      console.log(e)
    }
  },
  // /////////////////////////////////////////////////// getNewNotificationCount
  async getNewNotificationCount ({ commit }) {
    try {
      const response = await this.$axiosAuth.get('/get-new-notification-count')
      commit('SET_NEW_NOTIFICATION_COUNT', response.data.payload)
    } catch (e) {
      console.log('===== [Store Action: notifications/getNewNotificationCount]')
      console.log(e)
    }
  },
  // ////////////////////////////////////////////////////////// setLoadingStatus
  setLoadingStatus ({ commit }, payload) {
    commit('SET_LOADING_STATUS', payload)
  },
  // /////////////////////////////////////////////////////// setNotificationList
  setNotificationList ({ commit }, notificationList) {
    commit('SET_NOTIFICATION_LIST', notificationList)
  },
  // /////////////////////////////////////////////////// markNotificationsAsRead
  async markNotificationsAsRead ({ commit, getters, dispatch }, notificationIds) {
    try {
      await dispatch('setLoadingStatus', { type: 'loading', status: true })
      const notificationList = getters.notificationList
      const response = await this.$axiosAuth.post('/post-mark-notifications-read', notificationIds)
      const notifications = response.data.payload
      const len = notifications.length
      for (let i = 0; i < len; i++) {
        const notification = notifications[i]
        const index = notificationList.findIndex(obj => obj._id === notification._id)
        commit('UPDATE_NOTIFICATION', { index, notification })
      }
      await dispatch('getNewNotificationCount')
      dispatch('setLoadingStatus', { type: 'loading', status: false })
    } catch (e) {
      console.log('===== [Store Action: notifications/markNotificationsAsRead]')
      console.log(e)
      dispatch('setLoadingStatus', { type: 'loading', status: false })
    }
  },
  // //////////////////////////////////////////////// markAllNotificationsAsRead
  async markAllNotificationsAsRead ({ commit, getters, dispatch }) {
    try {
      await dispatch('setLoadingStatus', { type: 'loading', status: true })
      await this.$axiosAuth.post('/post-mark-all-notifications-read')
      const notificationList = CloneDeep(getters.notificationList)
      const len = notificationList.length
      for (let i = 0; i < len; i++) {
        const notification = notificationList[i]
        notification.read = true
        const index = notificationList.findIndex(obj => obj._id === notification._id)
        commit('UPDATE_NOTIFICATION', { index, notification })
      }
      await dispatch('getNewNotificationCount')
      dispatch('setLoadingStatus', { type: 'loading', status: false })
    } catch (e) {
      console.log('== [Store Action: notifications/markAllNotificationsAsRead]')
      console.log(e)
      dispatch('setLoadingStatus', { type: 'loading', status: false })
    }
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_NOTIFICATION_LIST (state, notificationList) {
    state.notificationList = notificationList
  },
  SET_METADATA (state, metadata) {
    state.metadata = metadata
  },
  UPDATE_NOTIFICATION (state, payload) {
    console.log(payload)
    state.notificationList.splice(payload.index, 1, payload.notification)
  },
  SET_NEW_NOTIFICATION_COUNT (state, count) {
    state.newCount = count
  },
  SET_LOADING_STATUS (state, payload) {
    state[payload.type] = payload.status
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
