console.log('💿 [model] fp_notification')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

// ////////////////////////////////////////////////////////////////////// Schema
// -----------------------------------------------------------------------------
const NotificationSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'fp_users',
    required: true
  },
  bucket: {
    type: String,
    required: true,
    enum: [
      'application',
      'kyc'
    ]
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  },
  custom: {
    type: Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true,
  minimize: false
})

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = Mongoose.model('fp_notification', NotificationSchema)
