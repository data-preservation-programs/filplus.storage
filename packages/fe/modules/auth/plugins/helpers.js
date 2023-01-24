/*
 *
 * 🔌 [Plugin | Auth] Helpers
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Axios from 'axios'
import { Agent } from 'https'
import { parse as ParseCookie } from 'cookie'

function parseSetCookies (cookies) {
  return cookies
    .map(cookie => cookie.split(';')[0])
    .reduce((obj, cookie) => ({
      ...obj,
      ...ParseCookie(cookie)
    }), {})
}

function serializeCookies (cookies) {
  return Object
    .entries(cookies)
    .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
    .join('; ')
}

function mergeSetCookies(oldCookies, newCookies) {
  const cookies = new Map()
  function add (setCookie) {
    const cookie = setCookie.split(';')[0]
    const name = Object.keys(ParseCookie(cookie))[0]
    cookies.set(name, cookie)
  }
  oldCookies.forEach(add)
  newCookies.forEach(add)
  return [...cookies.values()]
}

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////// CreateAxiosAuthTransport
const CreateAxiosAuthTransport = (req, res, baseURL) => {
  const axios = Axios.create({
    withCredentials: true,
    baseURL,
    ...process.env.NODE_ENV === 'development' && {
      httpsAgent: new Agent({
        rejectUnauthorized: false
      })
    }
  })
  // ----------------------------------------------------- [interceptor] request
  axios.interceptors.request.use(
    request => {
      if (process.server) {
        const cookie = req.headers.cookie
        if (cookie) {
          request.headers.common.cookie = cookie
        }
      }
      return request
    }
  )
  // ---------------------------------------------------- [interceptor] response
  axios.interceptors.response.use(
    response => {
      const setCookies = response.headers['set-cookie']
      if (setCookies) {
        const cookie = serializeCookies({
          ...ParseCookie(axios.defaults.headers.common.cookie || ''),
          ...parseSetCookies(setCookies)
        })
        axios.defaults.headers.common.cookie = cookie
        // If the res already has a Set-Cookie header it should be merged
        if (res.getHeader('Set-Cookie')) {
          const newCookies = mergeSetCookies(
            res.getHeader('Set-Cookie'),
            setCookies
          )
          res.setHeader('Set-Cookie', newCookies)
        } else {
          res.setHeader('Set-Cookie', setCookies)
        }
      }
      return response
    }
  )
  return axios
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ $config, req, res}, inject) => {
  inject('axiosAuth', CreateAxiosAuthTransport(req, res, $config.backendUrl))
}
