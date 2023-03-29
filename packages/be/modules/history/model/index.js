console.log('💿 [model] fp_histories')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const { IsValidObjectId } = require('@Module_Utilities')

const acceptedModels = [
  'fp_users',
  'fp_uploads'
]

const acceptedCrons = []

// ////////////////////////////////////////////////////////////////////// Schema
// -----------------------------------------------------------------------------
const HistorySchema = new Schema({
  bucket: {
    type: String,
    required: true,
    enum: [
      'user',
      'upload'
    ],
    index: true
  },
  event: {
    type: String,
    required: true,
    enum: [
      'create',
      'update',
      'initialize',
      'complete'
    ],
    index: true
  },
  initiator: { // the user or cron that triggered the event
    type: Schema.Types.Mixed, // ObjectId or string
    required: true,
    refPath: 'initiator_ref',
    index: true
  },
  client: { // to whom the event belongs (upon whom the change is occurring)
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'client_ref',
    index: true
  },
  subject: { // the transaction piece of the event
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'subject_ref',
    index: true
  },
  initiator_ref: {
    type: String,
    required: initiatorRefRequiredIfInitiatorIsUser,
    enum: acceptedModels,
    index: true
  },
  client_ref: {
    type: String,
    required: true,
    enum: acceptedModels,
    index: true
  },
  subject_ref: {
    type: String,
    required: true,
    enum: acceptedModels,
    index: true
  },
  before: {
    type: Schema.Types.Mixed,
    required: false,
    default: null
  },
  after: {
    type: Schema.Types.Mixed,
    required: false,
    default: null
  }
}, {
  timestamps: true,
  minimize: false
})

// ////////////////////////////////////////////////////////////// Before Actions
// -----------------------------------------------------------------------------

/**
 * An initiator can be a user (via interaction with UI) or a script. Need to be
 * able to differentiate between a user (a valid ObjectId) and a cron (restricted
 * options via an ENUM).
 */

HistorySchema.pre('validate', function (next) {
  const initiator = `${this.initiator}`
  const initiatorIsUser = IsValidObjectId(initiator)
  if (!initiatorIsUser && !acceptedCrons.includes(initiator)) {
    return next(new Error('the initiator passed was not found in the accepted crons list'))
  }
  next()
})

/**
 * The initiator_ref field is only required if the initiator is a user (with a
 * valid ObjectId)
 */

function initiatorRefRequiredIfInitiatorIsUser () {
  return IsValidObjectId(this.initiator)
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = Mongoose.model('fp_histories', HistorySchema)
