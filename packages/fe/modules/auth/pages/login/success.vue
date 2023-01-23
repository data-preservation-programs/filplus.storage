<script>
// ====================================================================== Export
export default {
  name: 'LoginSuccessPage',

  layout: 'auth',

  async asyncData ({ route, store, req, res }) {
    const query = route.query
    const strategy = query.strategy
    let token
    switch (strategy) {
      case 'github': token = query.code; break
    }
    const response = await store.dispatch('auth/login', { strategy, token })
    return {
      session: response.session,
      toast: response.toast
    }
  },

  data () {
    return {
      session: false,
      toast: false
    }
  },

  mounted () {
    if (!window.opener && window.opener !== window && window.name !== 'login-popup') {
      return this.$router.push('/')
    }
    const session = this.session
    if (session) {
      window.opener.postMessage({ session, toast: this.toast }, this.$config.frontendUrl)
    }
    window.close()
  },

  render () {
    return true
  }
}
</script>

<style lang="scss" scoped>
@keyframes dot {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}

// ///////////////////////////////////////////////////////////////////// General
.page {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.triple-dot-loader {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 100%;
  display: inline-block;
  background-color: white;
  animation: dot 1.4s infinite ease-in-out both;
  transition: 250ms ease-in-out;
  &.dot-1 {
    animation-delay: -0.32s;
  }
  &.dot-2 {
    animation-delay: -0.16s;
    margin: 0 0.25rem;
  }
}
</style>
