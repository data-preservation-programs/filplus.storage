// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
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
      console.log('======================== [Store Action: account/getAccount]')
      console.log(e)
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
