/*
 *
 * 🔌 [Plugin | Auth] Auth
 *
 */

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import NuxtMiddleware from '../middleware'
import AuthStore from '@/modules/auth/store/auth'

// This resolves to .nuxt/middleware.js

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// registerStore
const registerStore = (app, next) => {
  return new Promise((next) => {
    app.store.registerModule('auth', Object.assign({
      namespaced: true
    }, AuthStore))
    next()
  })
  if (next) { return next() }
}

// ////////////////////////////////////////////////////////// registerMiddleware
const registerMiddleware = () => {
  return new Promise((next) => {
    import('@/modules/auth/middleware/authenticate')
      .then((middleware) => {
        NuxtMiddleware.authenticate = middleware.default
        return next()
      })
  })
}

// /////////////////////////////////////////////////////////////// listenToLogin
const listenToLogin = (app, store, $config) => {
  return new Promise((next) => {
    if (process.client) {
      window.addEventListener('message', async (e) => {
        const data = e.data
        if ((e.origin !== $config.frontendUrl) || !data || e.source.name !== 'login-popup') { return }
        if (typeof data === 'object' && data.hasOwnProperty('session')) {
          app.$button('login-button').set({ loading: false })
          app.$toaster.add(data.toast)
          const session = data.session
          if (session) {
            await store.dispatch('auth/getAccount', session.userId)
            const redirectTo = $config.redirectAfterLogin
            if (redirectTo) {
              app.router.push(redirectTo.path)
            }
          }
        }
      }, false)
    }
    next()
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function ({ app, store, $config }, inject) {
  await registerStore(app)
  await registerMiddleware()
  await listenToLogin(app, store, $config)
}
