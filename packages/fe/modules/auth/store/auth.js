// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Config from '@/nuxt.config'

// /////////////////////////////////////////////////////////////////////// State
// ---------------------- https://vuex.vuejs.org/guide/modules.html#module-reuse
const state = () => ({
  account: false
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  account: state => state.account,
  accountIsAdmin: state => state.account ? state.account.isAdmin : false
}

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
      this.$button('login-button').set({ loading: false })
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
      this.$button('logout-button').set({ loading: false })
      const data = response.data
      this.$toaster.add({
        type: 'toast',
        code: data.code,
        category: 'success',
        message: data.message
      })
      const from = this.$router.history.current.path
      const redirectTo = Config.auth.redirectAfterLogout
      if (redirectTo.path && from !== redirectTo.path) { // if redirectAfterLogout exists and we're not on the same page we're redirecting to
        const path = redirectTo.path
        if (!redirectTo.match) { // if no need to do partial URL matches, just redirect from all routes
          this.$router.replace({ path })
        } else { // otherwise, choose which routes to redirect away from after logout
          redirectTo.match.forEach((partialRoute) => {
            if (from.includes(partialRoute)) {
              this.$router.replace({ path })
            }
          })
        }
      }
    } catch (e) {
      console.log(e)
      const data = e.response.data
      this.$toaster.add({
        type: 'toast',
        code: data.code,
        category: 'caution',
        message: data.message
      })
    }
    this.dispatch('auth/setAccount', false)
  },
  // //////////////////////////////////////////////////////////////// getAccount
  async getAccount ({ commit, dispatch }, userId) {
    try {
      const response = await this.$axiosAuth.get('/get-user', {
        params: {
          ...(userId && { userId })
        }
      })
      const account = response.data.payload
      if (!account) {
        dispatch('setAccount', false)
        return false
      }
      dispatch('setAccount', account)
      return account
    } catch (e) {
      console.log('=========================== [Store Action: auth/getAccount]')
      dispatch('setAccount', false)
    }
  },
  // //////////////////////////////////////////////////////////////// setAccount
  setAccount ({ commit }, account) {
    commit('SET_ACCOUNT', account)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_ACCOUNT (state, account) {
    state.account = account
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
