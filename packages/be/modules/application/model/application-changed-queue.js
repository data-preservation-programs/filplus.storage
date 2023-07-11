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
  issueId: {
    type: String,
    required: true
  },
  issueNumber: {
    type: Number,
    required: true
  },
  issueTitle: {
    type: String,
    required: true
  },
  issueUrl: {
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
  }]
}, {
  timestamps: true,
  minimize: false
})

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = Mongoose.model('fp_application_changed_queue', ApplicationChangedQueueSchema)
