<script>
// ====================================================================== Export
export default {
  name: 'Login',

  methods: {
    loginWith (strategy) {
      let oauthService
      switch (strategy) {
        case 'github': oauthService = this.$config.githubOAuthLink; break
      }
      window.open(oauthService, 'login-popup', 'width=600,height=600')
    }
  },

  render () {
    return this.$scopedSlots.default({
      loginWith: this.loginWith
    })
  }
}
</script>
