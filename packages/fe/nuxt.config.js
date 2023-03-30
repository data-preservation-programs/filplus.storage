// /////////////////////////////////////////////////////////// Variables & Setup
// -----------------------------------------------------------------------------
const env = process.env.SERVER_ENV

const baseUrls = {
  development: 'https://localhost',
  stable: 'https://stable.filplus.storage',
  production: 'https://filplus.storage'
}

const frontendPort = (function () {
  if (env === 'development') { return 12010 }
  return env === 'stable' ? 12020 : 12030
}())

const backendPort = (function () {
  if (env === 'development') { return 12040 }
  return env === 'stable' ? 12050 : 12060
}())

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  // ///////////////////////////////////////////////////// Runtime Configuration
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------- [Runtime] Public
  publicRuntimeConfig: {
    frontendUrl: env === 'development' ? `${baseUrls[env]}:${frontendPort}` : baseUrls[env],
    backendUrl: env === 'development' ? `${baseUrls[env]}:${backendPort}` : `${baseUrls[env]}/api`,
    githubOAuthLink: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&scope=user:email,public_repo`,
    serverFlag: env,
    seo: {
      siteName: 'Fil+'
    },
    socketOptions: {
      withCredentials: true
    }
  },
  // --------------------------------------------------------- [Runtime] Private
  privateRuntimeConfig: {},
  // /////////////////////////////////////////////////////////// Server & Render
  // ---------------------------------------------------------------------------
  server: {
    port: frontendPort,
    host: process.env.NODE_ENV !== 'development' ? '0.0.0.0' : 'localhost'
  },
  render: {
    bundleRenderer: {
      runInNewContext: false
    }
  },
  // /////////////////////////////////////////////////////// Headers of the Page
  // ---------------------------------------------------------------------------
  head: {
    title: 'Fil+',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Fil+' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon-96x96.png' }
    ]
  },
  // ////////////////////////////////////////// Customize the progress-bar color
  // ---------------------------------------------------------------------------
  loading: {
    color: '#FFFFFF',
    height: '4px'
  },
  // /////////////////////////////////////////////////////////// Global CSS/SCSS
  // ---------------------------------------------------------------------------
  css: [
    '~/assets/scss/main.scss'
  ],
  styleResources: {
    scss: [
      '~/assets/scss/variables.scss'
    ]
  },
  // /////////////////////////////////////////////////////// Nuxt.js Dev Modules
  // ---------------------------------------------------------------------------
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/moment-module#readme
    '@nuxtjs/moment'
  ],
  // /////////////////////////////////////////////////////////// Nuxt.js Modules
  // ---------------------------------------------------------------------------
  modules: [
    '@nuxtjs/style-resources', // https://github.com/nuxt-community/style-resources-module/
    '@nuxtjs/axios', // https://axios.nuxtjs.org/
    'nuxt-socket-io', // https://nuxt-socket-io.netlify.app/
    '@nuxtjs/gtm', // https://github.com/nuxt-community/gtm-module#nuxtjsgtm
    '~/modules/https',
    '~/modules/toaster',
    // '~/modules/slider',
    // '~/modules/alert',
    '~/modules/auth',
    '~/modules/search',
    '~/modules/form',
    '~/modules/button',
    '~/modules/ls'
  ],
  // /////////////////////////////////// Plugins to load before mounting the App
  // ---------------------------------------------------------------------------
  plugins: [
    '~/plugins/helpers',
    '~/plugins/directives',
    '~/plugins/seo',
    '~/plugins/scroll-to',
    // '~/plugins/in-viewport',
    '~/plugins/uuid'
  ],
  // ///////////////////////////////////////////////////////// [Module] MomentJS
  // ---------------------- Doc: https://github.com/nuxt-community/moment-module
  moment: {
    timezone: true,
    defaultTimezone: 'UTC'
  },
  // ////////////////////////////////////////////////////////////// [Module] GTM
  // ------------------------- Doc: https://github.com/nuxt-community/gtm-module
  gtm: {
    enabled: env === 'production', // disable in all but production
    // Currently hardcoded, can be added as an environment variable instead
    id: 'GTM-MNFJ3D4',
    pageTracking: true
  },
  // ///////////////////////////////////////////////////////////// [Module] Auth
  // ---------------------------------------------------------------------------
  auth: {
    redirectUnauthenticated: '/apply',
    redirectAfterLogin: {
      unregistered: {
        path: '/apply',
        key: 'githubUsername'
      },
      registered: {
        path: '/apply',
        key: 'githubUsername'
      }
    },
    redirectAfterLogout: {
      path: '/apply',
      match: [
        '/account'
      ]
    }
  },
  // /////////////////////////////////////////////////////////////// [Module] ls
  // ---------------------------------------------------------------------------
  ls: {
    prefix: 'filplus__'
  },
  // //////////////////////////////////////////////////////////// [Module] Axios
  // -------------------------------------- See https://axios.nuxtjs.org/options
  axios: {},
  // /////////////////////////////////////////////////// [Module] Nuxt Socket.io
  // ---------------------------------- Doc: https://nuxt-socket-io.netlify.app/
  io: {
    sockets: [{
      url: env === 'development' ? `${baseUrls[env]}:${backendPort}` : baseUrls[env]
    }]
  },
  // ////////////////////////////////////////////////////////// [Plugin] Toaster
  // ---------------------------------------------------------------------------
  toaster: {
    display: 10,
    timeout: 5000
  },
  // /////////////////////////////////////////////////////// Router + Middleware
  // ---------------------------------------------------------------------------
  // router: {
  //   middleware: ['modify']
  // },
  // /////////////////////////////////////////////////////// Build configuration
  // ------------------------------------------------ Extend webpack config here
  build: {
    // ---------------------------------------------------------- Hot Middleware
    hotMiddleware: {
      client: {
        overlay: false
      }
    },
    // -------------------------------------------------------------- Extensions
    extend (config, ctx) {
      config.module.rules.push({
        test: /\.md$/,
        use: 'raw-loader'
      })
    }
  }
}
