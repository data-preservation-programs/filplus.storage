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
  async getAccount ({ commit }, githubUsername) {
    try {
      const response = await this.$axiosAuth.get('/get-user', {
        params: { githubUsername }
      })
      const account = response.data.payload
      if (!account) { return false }
      commit('SET_ACCOUNT', account)
      return account
    } catch (e) {
      console.log('======================== [Store Action: account/getAccount]')
      console.log(e)
    }
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
