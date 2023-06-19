console.log('💿 [model] fp_notification')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

// ////////////////////////////////////////////////////////////////////// Schema
// -----------------------------------------------------------------------------
const NotificationSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'fp_users',
    required: true
  },
  bucket: {
    type: String,
    required: true,
    enum: [
      'application'
    ]
  },
  message: {
    type: String,
    required: true
  },
}, {
  timestamps: true,
  minimize: false
})

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = Mongoose.model('fp_notification', NotificationSchema)
