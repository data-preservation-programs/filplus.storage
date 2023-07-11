console.log('💡 [endpoint] /post-mark-all-notifications-read')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/post-mark-all-notifications-read', async (req, res) => {
  try {
    const identifier = req.session.identifier
    if (!identifier) { throw ThrowError(200, 'You are not logged in') }
    const notifications = await MC.model.Notification.find({
      owner: identifier.userId,
      read: false
    })
    const operations = notifications.map((notification) => {
      return {
        updateOne: {
          filter: { _id: notification._id },
          update: { $set: { read: true } },
          upsert: true
        }
      }
    })
    const response = await MC.model.Notification.bulkWrite(operations, { ordered: false })
    SendData(res, 200, 'All notifications marked read succesfully')
  } catch (e) {
    console.log('=============== [Endpoint: /post-mark-all-notifications-read]')
    console.log(e)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
