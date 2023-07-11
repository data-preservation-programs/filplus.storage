console.log('💡 [endpoint] /post-mark-notifications-read')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/post-mark-notifications-read', async (req, res) => {
  try {
    const notificationIds = req.body
    const updated = []
    const len = notificationIds.length
    for (let i = 0; i < len; i++) {
      const id = notificationIds[i]
      const notification = await MC.model.Notification.findById(id)
      notification.read = true
      const saved = await notification.save()
      updated.push(saved)
    }
    SendData(res, 200, 'Notifications marked read succesfully', updated)
  } catch (e) {
    console.log('=================== [Endpoint: /post-mark-notifications-read]')
    console.log(e)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
