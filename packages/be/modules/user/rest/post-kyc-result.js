console.log('💡 [endpoint] /post-kyc-result')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const FindUser = require('@Module_User/logic/find-user')
const UpdateUser = require('@Module_User/logic/update-user')
const PushNotification = require('@Module_Notification/logic/push-notification')
const PushLaudspeakerNotification = require('@Module_Notification/logic/push-laudspeaker-notification')
const Moment = require('moment-timezone')

const MC = require('@Root/config')
const serverFlag = MC.serverFlag

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/post-kyc-result', async (req, res) => {
  try {
    const kyc = req.body
    kyc.webhookResponseTimestamp = Moment().tz('UTC').toISOString()
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
    // ----------------------------------------------- parse returned kyc object
    if (kyc.event === 'success' || kyc.event === 'approve') {
      kyc.data.custom.createdAt = kyc.data.kyc.createdAt
      delete kyc.data.kyc
    } else if (kyc.event === 'failure') {
      kyc.error.custom.createdAt = kyc.error.kyc.createdAt
      delete kyc.error.kyc
    }
    console.log('============================================ /post-kyc-result')
    console.log(kyc)
    // -------------------------------------------------------- populate history
    const kycHistory = user.kycHistory
    kycHistory.push(kyc)
    const saved = await UpdateUser({ _id: user._id, kyc, kycHistory })
    MC.socket.io.to(`${saved._id}`).emit('module|kyc-updated|payload', saved)
    // ---------------------------- push notification + laudspeaker notification
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
    let upsertData
    let eventData
    if (kyc.event === 'success' || kyc.event === 'approve') {
      notification.custom.success = {
        createdAt: kyc.data.custom.createdAt
      }
      // data that needs to be added to Laudspeaker user for email template
      upsertData = {
        correlationKey: 'email',
        correlationValue: kyc.data.custom.email,
        githubUsername: kyc.data.custom.identifier
      }
      // data needed for event trigger in Journey
      eventData = {
        correlationKey: 'email',
        correlationValue: kyc.data.custom.email,
        source: 'custom',
        event: `kyc-${kyc.event}`
      }
    } else if (kyc.event === 'failure') {
      notification.custom.failure = {
        createdAt: kyc.error.custom.createdAt,
        name: kyc.error.name,
        message: kyc.error.message
      }
      // data that needs to be added to Laudspeaker user for email template
      upsertData = {
        correlationKey: 'email',
        correlationValue: kyc.error.custom.email,
        githubUsername: kyc.error.custom.identifier,
        failureMessage: kyc.error.message
      }
      // data needed for event trigger in Journey
      eventData = {
        correlationKey: 'email',
        correlationValue: kyc.error.custom.email,
        source: 'custom',
        event: `kyc-${kyc.event}`
      }
    }
    await PushLaudspeakerNotification(eventData, upsertData)
    await PushNotification(notification)
    // -------------------------------------------------------------------- send
    SendData(res, 200, 'KYC result recorded successfully', saved)
  } catch (e) {
    console.log('================================ [Endpoint: /post-kyc-result]')
    console.log(e)
    SendData(res, 500, 'Something went wrong. Please try again.')
  }
})
