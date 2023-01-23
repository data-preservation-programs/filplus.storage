/*
 *
 * 📦 [Module] Auth
 *
 */

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import Path from 'path'

const plugins = ['index', 'helpers']
const pages = ['login/success']
const layouts = ['auth']

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////// performStartupChecks
const performStartupChecks = (instance) => {
  // Check for existence of config variables
  return new Promise((next) => {
    const Config = instance.options
    if (!Config.hasOwnProperty('auth')) { throw new Error('"auth" configuration block is missing from nuxt.config.js') }
    if (!Config.auth.hasOwnProperty('redirectAfterLogin')) { throw new Error('"auth.redirectAfterLogin" parameter is missing from nuxt.config.js') }
    if (!Config.auth.redirectAfterLogin.hasOwnProperty('registered')) { throw new Error('"auth.redirectAfterLogin.registered" parameter is missing from nuxt.config.js') }
    if (!Config.auth.redirectAfterLogin.registered.hasOwnProperty('path')) { throw new Error('"auth.redirectAfterLogin.registered.path" parameter is missing from nuxt.config.js') }
    if (!Config.auth.redirectAfterLogin.registered.hasOwnProperty('key')) { throw new Error('"auth.redirectAfterLogin.registered.key" parameter is missing from nuxt.config.js') }
    if (!Config.auth.redirectAfterLogin.hasOwnProperty('unregistered')) { throw new Error('"auth.redirectAfterLogin.unregistered" parameter is missing from nuxt.config.js') }
    if (!Config.auth.redirectAfterLogin.unregistered.hasOwnProperty('path')) { throw new Error('"auth.redirectAfterLogin.unregistered.path" parameter is missing from nuxt.config.js') }
    if (!Config.auth.redirectAfterLogin.unregistered.hasOwnProperty('key')) { throw new Error('"auth.redirectAfterLogin.unregistered.key" parameter is missing from nuxt.config.js') }
    if (!Config.publicRuntimeConfig.hasOwnProperty('githubOAuthLink')) {
      throw new Error('"publicRuntimeConfig.githubOAuthLink" parameter is missing from nuxt.config.js')
    }
    next()
  })
}

// ////////////////////////////////////////////////////////// registerMiddleware
const registerMiddleware = (instance, next) => {
  return new Promise((next) => {
    // The functionality of the middleware below is imported in @/modules/auth/plugins/index.js
    instance.options.router.middleware.push('authenticate')
    next()
  })
}

// ////////////////////////////////////////////////////////////// registerPlugin
const registerPlugin = (instance, next) => {
  return new Promise((next) => {
    plugins.forEach((plugin) => {
      const dst = instance.addTemplate({
        src: Path.resolve(__dirname, `plugins/${plugin}.js`),
        fileName: `auth/plugin-${plugin}.js`
      }).dst
      instance.options.plugins.push({
        src: Path.join(instance.options.buildDir, dst),
        ssr: undefined,
        mode: undefined
      })
    })
    next()
  })
}

// ///////////////////////////////////////////////////////////// registerLayouts
const registerLayouts = (instance, next) => {
  return new Promise((next) => {
    layouts.forEach((layout) => {
      instance.addLayout({
        src: Path.resolve(__dirname, `layouts/${layout}.vue`),
        fileName: `auth/layout-${layout}.vue`
      }, layout)
    })
    next()
  })
}

// ////////////////////////////////////////////////////////////// registerRoutes
const registerRoutes = (instance) => {
  return new Promise((next) => {
    instance.options.router.extendRoutes = (routes) => {
      pages.forEach((page) => {
        routes.push({
          name: page.replace('/', '-'),
          path: `/${page}`,
          component: Path.resolve(__dirname, `pages/${page}.vue`)
        })
      })
    }
    next()
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function () {
  await performStartupChecks(this)
  await registerMiddleware(this)
  await registerPlugin(this)
  await registerLayouts(this)
  await registerRoutes(this)
}
