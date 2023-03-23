console.log('💿 [model] fp_users')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema
const MongooseLeanGetter = require('mongoose-lean-getters')
const { Encrypt, Decrypt } = require('@Logic/cipher')

// ////////////////////////////////////////////////////////////////////// Schema
// -----------------------------------------------------------------------------
const UserSchema = new Schema({
  githubUsername: {
    type: String,
    required: true,
    unique: true
  },
  githubAvatarUrl: {
    type: String,
    required: false
  },
  githubHtmlUrl: {
    type: String,
    required: false
  },
  githubEmail: {
    type: String,
    required: false,
    default: null
  },
  email: {
    type: String,
    required: false,
    default: null
  },
  hubspotOptIn: {
    type: Boolean,
    required: false,
    default: false
  },
  hubspotOptInEmail: {
    type: String,
    required: false,
    default: null
  },
  disabled: {
    type: Boolean,
    required: false
  },
  githubToken: {
    type: String,
    set: Encrypt,
    get: Decrypt,
    required: true
  }
}, {
  timestamps: true,
  minimize: false,
  toObject: { getters: true, setters: true },
  toJSON: { getters: true, setters: true },
  runSettersOnQuery: true
})

// ///////////////////////////////////////////////////////////////////// Plugins
// -----------------------------------------------------------------------------
UserSchema.plugin(MongooseLeanGetter)

// ////////////////////////////////////////////////////////////// Before Actions
// -----------------------------------------------------------------------------
UserSchema.pre('validate', function (next) {
  if (this.githubEmail === '') { this.githubEmail = null }
  if (this.email === '') { this.email = null }
  if (this.hubspotOptInEmail === '') { this.hubspotOptInEmail = null }
  next()
})

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = Mongoose.model('fp_users', UserSchema)
