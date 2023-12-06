// ////////////////////////////////////////////////// Imports, Variables & Setup
// -----------------------------------------------------------------------------
const Path = require('path')

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

const corsAllowlist = [
  'https://localhost:12010', // fe | development
  'https://stable.filplus.storage', // fe | stable
  'https://filplus.storage', // fe | production
  'https://stg-kyc.api.togggle.io', // Togggle | staging
  'https://kyc.api.togggle.io' // Togggle | production
]

if (env === 'development') {
  corsAllowlist.push(process.env.NGROK__URL) // for testing Github webhooks
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = {
  // ===================================================================== Paths
  packageRoot: __dirname,
  repoRoot: Path.resolve(__dirname, '../../'),
  cacheRoot: Path.resolve(__dirname, 'cache'),
  staticRoot: Path.resolve(__dirname, 'static'),
  publicRoot: Path.resolve(__dirname, 'public'),
  tmpRoot: Path.resolve(__dirname, 'tmp'),
  serverRoot: Path.resolve(
    __dirname,
    env === 'development' ? '../../../' : '../../../../'
  ),
  // ============================================================= Server Config
  port: backendPort,
  baseUrls,
  frontendUrl: env === 'development' ? `${baseUrls[env]}:${frontendPort}` : baseUrls[env],
  backendUrl: env === 'development' ? `${baseUrls[env]}:${backendPort}` : `${baseUrls[env]}/api`,
  websocketUrl: env === 'development' ? `${baseUrls[env]}:${backendPort}` : baseUrls[env],
  repos: {
    ga: {
      production: 'filecoin-project/filecoin-plus-client-onboarding',
      stable: 'data-preservation-programs/filecoin-plus-client-onboarding',
      development: 'data-preservation-programs/filecoin-plus-client-onboarding'
    },
    lda: {
      production: 'filecoin-project/filecoin-plus-large-datasets',
      stable: 'data-preservation-programs/filecoin-plus-large-datasets',
      development: 'data-preservation-programs/filecoin-plus-large-datasets'
    },
    falcon: {
      production: 'filecoin-project/filecoin-plus-falcon',
      stable: 'filecoin-project/filplus-tooling-backend-test',
      development: 'filecoin-project/filplus-tooling-backend-test'
    }
  },
  // ==================================================================== Server
  server: false,
  serverFlag: env,
  autocreateEntities: [
    { type: 'dir', path: 'static' },
    { type: 'dir', path: 'cache' },
    { type: 'dir', path: 'tmp' },
    { type: 'dir', path: 'tmp/uploads' },
    { type: 'dir', path: 'public' },
    { type: 'dir', path: 'public/uploads' },
    { type: 'dir', path: 'tmp' },
    { type: 'file', path: 'tmp/app-version.json', data: { version: '' } }
  ],
  serveStaticDirectories: [],
  // ================================================================== Database
  databaseUrl: process.env.DATABASE_URL, // for x509 auth, use process.env.DATABASE_URL_X509
  mongoConnectionOptions: {
    // Authenticate with username/password
    auth: {
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
    }
    // Authenticate using x509 certificates
    // ssl: true,
    // sslValidate: true,
    // sslCA: Path.resolve(process.env.DPP_CA_PATH),
    // sslKey: Path.resolve(process.env.MONGODB_CLIENT_PEM),
    // sslCert: Path.resolve(process.env.MONGODB_CLIENT_PEM),
    // authMechanism: 'MONGODB-X509'
  },
  mongooseConnection: false,
  model: {},
  // ================================================================= Socket.Io
  socket: {
    io: false,
    listeners: []
  },
  // ======================================================== Session Management
  expressSessionOptions: {
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: false,
    proxy: process.env.NODE_ENV !== 'development' ? true : undefined,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Expires in 24hrs
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      unset: 'destroy'
    }
  },
  expressSession: false,
  // ====================================================================== CORS
  cors: {
    origin: function (origin, next) {
      if (!origin) { return next(null, false) }
      const allowed = corsAllowlist.indexOf(origin) !== -1
      if (allowed) { return next(null, true) }
      console.log(`CORS failed → ${origin}`)
      next(null, false)
    },
    methods: 'OPTIONS,GET,POST',
    allowedHeaders: 'Origin,Accept,Authorization,X-Requested-With,Content-Type,Cache-Control',
    credentials: true,
    optionsSuccessStatus: 200
  },
  // =================================================================== Modules
  modules: {
    // ---------------------------------------------------------------- Uploader
    uploader: {
      chunkSize: 50000
    },
    // -------------------------------------------------------------------- Auth
    auth: {
      adminOnlyAppWide: false
    }
  }
}
