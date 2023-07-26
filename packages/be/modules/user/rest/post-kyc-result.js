console.log('💡 [endpoint] /post-kyc-result')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const FindUser = require('@Module_User/logic/find-user')
const UpdateUser = require('@Module_User/logic/update-user')
const PushNotification = require('@Module_Notification/logic/push-notification')

const MC = require('@Root/config')
const serverFlag = MC.serverFlag

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/post-kyc-result', async (req, res) => {
  try {
    const kyc = req.body
    console.log('============================================ /post-kyc-result')
    console.log(kyc)
    // ------------------------------------------------------------ run checkers
    let data = kyc.data || kyc.error
    if (!data || data === '') {
      return SendData(res, 422, '<data> key is missing')
    }
    data = data.custom
    const githubUsername = data.identifier
    if (!githubUsername || githubUsername === '') {
      return SendData(res, 422, '<identifier> param is missing')
    }
    const env = data.environment
    if (!env || env === '') {
      data.environment = serverFlag
    }
    const user = await FindUser({ githubUsername })
    if (!user) {
      return SendData(res, 422, 'Could not find user associated with <identifier>', { identifier: githubUsername })
    }
    // -------------------------------------------------------- populate history
    const kycHistory = user.kycHistory
    kycHistory.push(kyc)
    const saved = await UpdateUser({ _id: user._id, kyc, kycHistory })
    MC.socket.io.to(`${saved._id}`).emit('module|kyc-updated|payload', saved)
    // ------------------------------------------------------- push notification
    const notification = {
      ownerId: user._id,
      bucket: 'kyc',
      read: false,
      custom: {
        event: kyc.event,
        success: null,
        failure: null
      }
    }
    if (kyc.event === 'success' || kyc.event === 'approve') {
      notification.custom.success = {
        createdAt: kyc.data.kyc.createdAt
      }
    } else if (kyc.event === 'failure') {
      notification.custom.failure = {
        name: kyc.error.name,
        message: kyc.error.message
      }
    }
    await PushNotification(notification)
    // -------------------------------------------------------------------- send
    SendData(res, 200, 'KYC result recorded successfully', saved)
  } catch (e) {
    console.log('================================ [Endpoint: /post-kyc-result]')
    console.log(e)
    SendData(res, 500, 'Something went wrong. Please try again.')
  }
})
