// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  // ///////////////////////////////////////////////////// Runtime Configuration
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------- [Runtime] Public
  publicRuntimeConfig: {
    backendUrl: (function () {
      const env = process.env.SERVER_ENV
      let uri = 'https://localhost:14000' // development
      switch (env) {
        case 'stable': uri = ''; break
        case 'production': uri = ''; break
      } return uri
    }()),
    frontendUrl: (function () {
      const env = process.env.SERVER_ENV
      let uri = 'https://localhost:11000' // development
      switch (env) {
        case 'stable': uri = ''; break
        case 'production': uri = ''; break
      } return uri
    }()),
    githubOAuthLink: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&scope=user:email`,
    serverFlag: process.env.SERVER_ENV,
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
    port: (function () {
      const env = process.env.SERVER_ENV
      let port = 11000 // development
      switch (env) {
        case 'stable': port = 11001; break
        case 'production': port = 11002; break
      } return port
    }()),
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
    '@nuxtjs/style-resources', // Doc: https://github.com/nuxt-community/style-resources-module/
    '@nuxtjs/axios', // Doc: https://axios.nuxtjs.org/usage
    'nuxt-socket-io', // Doc: https://nuxt-socket-io.netlify.app/
    '~/modules/https',
    '~/modules/toaster',
    // '~/modules/slider',
    // '~/modules/alert',
    // '~/modules/auth',
    // '~/modules/search',
    '~/modules/form',
    '~/modules/button'
  ],
  // /////////////////////////////////// Plugins to load before mounting the App
  // ---------------------------------------------------------------------------
  plugins: [
    '~/plugins/helpers',
    '~/plugins/directives',
    '~/plugins/seo',
    '~/plugins/scroll-to'
    // '~/plugins/in-viewport',
    // '~/plugins/uuid'
  ],
  // ///////////////////////////////////////////////////////// [Module] MomentJS
  // ---------------------- Doc: https://github.com/nuxt-community/moment-module
  moment: {
    timezone: true,
    defaultTimezone: 'UTC'
  },
  // ///////////////////////////////////////////////////////////// [Module] Auth
  // ---------------------------------------------------------------------------
  // auth: {
  //   redirectAfterLogin: {
  //     unregistered: {
  //       path: '/account/:key',
  //       key: 'githubUsername'
  //     },
  //     registered: {
  //       path: '/account/:key/datasets/claimed',
  //       key: 'githubUsername'
  //     }
  //   },
  //   redirectAfterLogout: '/'
  // },
  // ////////////////////////////////////////////////////////// [Module] Account
  // ---------------------------------------------------------------------------
  // account: {
  //   redirectAfterRegistering: {
  //     path: '/account/:key/datasets/all',
  //     key: 'githubUsername'
  //   }
  // },
  // //////////////////////////////////////////////////////////// [Module] Axios
  // -------------------------------------- See https://axios.nuxtjs.org/options
  axios: {},
  // /////////////////////////////////////////////////// [Module] Nuxt Socket.io
  // ---------------------------------- Doc: https://nuxt-socket-io.netlify.app/
  io: {
    sockets: [{
      url: (function () {
        const env = process.env.SERVER_ENV
        let uri = 'https://localhost:14000' // development
        switch (env) {
          case 'stable': uri = ''; break
          case 'production': uri = ''; break
        } return uri
      }())
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
