// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Config from '@/nuxt.config'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////////////// authenticate
const authenticate = async (store, from, route, redirect, guarded, redirectUnauthenticated) => {
  if (process.client && from && from.path === route.path) {
    return
  }
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
const HandleUnauthorized = async (store, from, route, redirect) => {
  const meta = route.meta.find(obj => obj.hasOwnProperty('guarded'))
  const guarded = (meta && meta.guarded) || false
  await authenticate(store, from, route, redirect, guarded, Config.auth.redirectUnauthenticated)
}

// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
export default async ({ store, from, route, redirect }) => {
  if (route.path.includes('login')) { return } // no need to authenticate on /login/success page
  await HandleUnauthorized(store, from, route, redirect)
}
