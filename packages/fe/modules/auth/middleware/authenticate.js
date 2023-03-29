// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Config from '@/nuxt.config'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////////////// authenticate
const authenticate = async (store, redirect, guarded, redirectUnauthenticated) => {
  try {
    const authenticated = await store.dispatch('auth/authenticate', guarded)
    const account = store.getters['auth/account']
    if (authenticated && authenticated.userId && !account) {
      await store.dispatch('auth/getAccount', authenticated.userId)
    }
    return authenticated
  } catch (e) {
    const data = e.response.data
    const code = data.code
    const message = data.message
    const toast = {
      type: 'toast',
      code: code || 500,
      category: code && message ? 'success' : 'error',
      message: message || 'Something went wrong, please try again'
    }
    if (guarded) {
      redirect({ path: redirectUnauthenticated, query: { toast: JSON.stringify(toast) } })
    }
  }
}

// ////////////////////////////////////////////////////////// handleUnauthorized
const HandleUnauthorized = async (store, route, redirect) => {
  const meta = route.meta.find(obj => obj.hasOwnProperty('authenticate'))
  const guarded = (meta && meta.authenticate) || false
  await authenticate(store, redirect, guarded, Config.auth.redirectUnauthenticated)
}

// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
export default async ({ store, route, redirect }) => {
  await HandleUnauthorized(store, route, redirect)
}
