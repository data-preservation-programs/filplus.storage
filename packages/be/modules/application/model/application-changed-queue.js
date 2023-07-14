console.log('💿 [model] fp_application_changed_queue')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

// ////////////////////////////////////////////////////////////////////// Schema
// -----------------------------------------------------------------------------
const ApplicationChangedQueueSchema = new Schema({
  githubUsername: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  labels: [{
    type: String,
    required: true
  }],
  // Issues
  issueId: {
    type: String,
    required: false,
    default: null
  },
  issueNumber: {
    type: Number,
    required: false,
    default: null
  },
  issueTitle: {
    type: String,
    required: false,
    default: null
  },
  issueUrl: {
    type: String,
    required: false,
    default: null
  },
  // PRs
  prId: {
    type: String,
    required: false,
    default: null
  },
  prNumber: {
    type: Number,
    required: false,
    default: null
  },
  prTitle: {
    type: String,
    required: false,
    default: null
  },
  prUrl: {
    type: String,
    required: false,
    default: null
  }
}, {
  timestamps: true,
  minimize: false
})

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = Mongoose.model('fp_application_changed_queue', ApplicationChangedQueueSchema)
