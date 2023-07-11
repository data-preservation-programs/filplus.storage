// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const MC = require('@Root/config')

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (notification) => {
  try {
    await MC.model.Notification.create(notification)
    MC.socket.io.to(`${notification.ownerId}`).emit('push-notification|refresh-notifications|event')
  } catch (e) {
    console.log('=================================== [Logic: PushNotification]')
    console.log(e)
  }
}
