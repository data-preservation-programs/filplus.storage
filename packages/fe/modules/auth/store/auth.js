// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Config from '@/nuxt.config'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = {}

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // ////////////////////////////////////////////////////////////// authenticate
  async authenticate ({ commit }, guarded) {
    try {
      const response = await this.$axiosAuth.get('/authenticate', {
        params: { guarded }
      })
      const identifier = response.data.payload
      if (identifier) { return identifier }
      return false
    } catch (e) {
      return false
    }
  },
  // ///////////////////////////////////////////////////////////////////// login
  async login ({ commit }, payload) {
    try {
      const response = await this.$axiosAuth.get('/login', {
        params: payload // { strategy, token }
      })
      this.dispatch('button/removeLoader', 'login-button')
      const data = response.data
      return {
        session: data.payload,
        toast: {
          type: 'toast',
          code: data.code,
          category: 'success',
          message: data.message
        }
      }
    } catch (e) {
      return false
    }
  },
  // //////////////////////////////////////////////////////////////////// logout
  async logout ({ commit }, token) {
    try {
      const response = await this.$axiosAuth.get('/logout')
      this.dispatch('button/removeLoader', 'logout-button')
      const data = response.data
      this.$toaster.add({
        type: 'toast',
        code: data.code,
        category: 'success',
        message: data.message
      })
      const from = this.$router.history.current.path
      const to = Config.auth.redirectAfterLogout
      if (to && from !== to) {
        this.$router.replace({ path: to })
      }
    } catch (e) {
      const data = e.response.data
      this.$toaster.add({
        type: 'toast',
        code: data.code,
        category: 'caution',
        message: data.message
      })
    }
    this.dispatch('account/setAccount', false)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  state,
  getters,
  actions,
  mutations
}
