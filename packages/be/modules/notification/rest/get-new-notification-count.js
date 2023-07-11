console.log('💡 [endpoint] /get-new-notification-count')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, ThrowError } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-new-notification-count', async (req, res) => {
  try {
    const query = req.query
    const identifier = req.session.identifier
    if (!identifier) { throw ThrowError(200, 'You are not logged in') }
    const count = await MC.model.Notification.find({
      ownerId: identifier.userId,
      read: false
    }).countDocuments()
    SendData(res, 200, 'New notifications count retrieved succesfully', count)
  } catch (e) {
    if (e.code !== 200) {
      console.log('======================== [Endpoint: /get-new-notification-count]')
      console.log(e)
    }
    SendData(res, e.code || 422, e.message || 'Something went wrong, please try logging in again', 0)
  }
})
