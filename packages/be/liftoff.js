console.log('🚀️ [app] liftoff')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
const Cors = require('cors')
const BodyParser = require('body-parser')
const ExpressSession = require('express-session')
const MongoStore = require('connect-mongo')
const Fs = require('fs-extra')
require('mongoose')

const MC = require('@Root/config')

// /////////////////////////////////////////////////// Add CORS response headers
// -----------------------------------------------------------------------------
MC.app.use(Cors(MC.cors))

// ////////////////////////////////////////////////////// Initialize Body Parser
// -----------------------------------------------------------------------------
MC.app.use(BodyParser.urlencoded({ extended: true, limit: '25mb' }))
MC.app.use(BodyParser.json({ limit: '25mb' }))

// ////////////////////////////////////////////////// Initialize Express Session
// -----------------------------------------------------------------------------
MC.expressSessionOptions.store = MongoStore.create({
  client: MC.mongooseConnection
})
MC.expressSession = ExpressSession(MC.expressSessionOptions)
MC.app.use(MC.expressSession)

// ////////////////////////////////////////////////////////// Import all Modules
// -----------------------------------------------------------------------------
try {
  const excluded = ['database', 'utilities']
  const modulesRoot = `${MC.packageRoot}/modules`
  const items = Fs.readdirSync(modulesRoot)
  let modulePath
  items.forEach((name) => {
    if (!excluded.includes(name)) {
      modulePath = `${modulesRoot}/${name}`
      if (Fs.statSync(modulePath).isDirectory()) {
        const moduleName = (name[0].toUpperCase() + name.substring(1)).replace(/-./g, x => x[1].toUpperCase())
        require(`@Module_${moduleName}`)
      }
    }
  })
} catch (e) {
  console.log(e)
}

// /////////////////////////////////////////////////////////////////////////////
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////////////// users
// const users = async () => {
//   try {
//     const user = await MC.model.User.findOne({ githubUsername: 'timelytree' })
//     console.log(user)
//     // const users = await MC.model.User.findById('')
//     // const users = await MC.model.User.find().sort({ createdAt: 1 })
//     // console.log(users.length)
//     // user.hubspotOptIn = false
//     // user.hubspotOptInContactId = undefined
//     // user.hubspotOptInEmail = undefined
//     // user.hubspotOptInFirstName = undefined
//     // user.hubspotOptInLastName = undefined
//     // user.hubspotOptInApplicationCompanyName = undefined
//     // user.hubspotOptInApplicationRegion = undefined
//     // user.hubspotOptInApplicationDatacapRequested = undefined
//     // user.hubspotOptInApplicationWalletAddress = undefined
//     // const saved = await user.save()
//     // console.log(saved)
//   } catch (e) {
//     console.log(e)
//   }
//   // try {
//   //   const user = await MC.model.User.deleteOne({ githubUsername: 'timelytree' })
//   //   console.log(user)
//   // } catch (e) {
//   //   console.log(e)
//   // }
// }; users()

// /////////////////////////////////////////////////////// populateNotifications
// const PushNotification = require('@Module_Notification/logic/push-notification')
const notifications = async () => {
  try {
    // await PushNotification({
    //   ownerId: '642ec896462dfdf618234a8c',
    //   bucket: 'application',
    //   read: false,
    //   custom: {
    //     state: 'asd',
    //     issueNumber: 123,
    //     issueTitle: 'Isueeeee'
    //   }
    // })
    // const queued = await MC.model.ApplicationChangedQueue
    //   .find()
    //   .sort({ createdAt: -1 })
    //   .select('-_id -createdAt -updatedAt -__v')
    //   .lean()
    // console.log(queued)
    // const notifications = await MC.model.Notification
    //   .find({ ownerId: '642ec896462dfdf618234a8c' })
    //   .lean()
    // console.log(notifications)
    // await MC.model.Notification.collection.drop()
    // await MC.model.ApplicationChangedQueue.collection.drop()
    // const author = '642ec896462dfdf618234a8c'
    // const bucket = 'application'
    // const notifications = [
    //   { author, bucket, message: 'Lorem ipsum dolor sit amet, consectetur' },
    //   { author, bucket, message: 'Notification with some <strong>bolded</strong> html' },
    //   { author, bucket, message: 'Dolor sit amet, consectetur adipiscing elit' },
    //   { author, bucket, message: 'Wow lorem this ipsum is dolor a really amet long notification, it lorem keeps ipsum on dolor going amet and lorem going' },
    //   { author, bucket, message: 'Notification with <a href="https://example.com">a link</a> in the html' },
    //   { author, bucket, message: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia' },
    //   { author, bucket, message: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem' },
    //   { author, bucket, message: 'Nemo enim ipsam voluptatem quia' },
    //   { author, bucket, message: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur' },
    //   { author, bucket, message: 'Quis autem vel eum iure reprehenderit' }
    // ]
    // const len = notifications.length
    // for (let i = 0; i < len; i++) {
    //   const created = await MC.model.Notification.create(notifications[i])
    //   console.log(created)
    // }
    // const user = await MC.model.User.findOne({ githubUsername: 'timelytree' })
    // console.log(user)
    // user.kyc = {
    //   event: 'success'
    // }
    // const saved = await user.save()
    // console.log(saved)
  } catch (e) {
    console.log(e)
  }
}; notifications()

// ///////////////////////////////////////////////////////////////////////// kyc
// const kyc = async () => {
//   try {
//     // const users = await MC.model.User.find()
//     // const len = users.length
//     // for (let i = 0; i < len; i++) {
//     //   const user = users[i]
//     //   const kyc = user.kyc
//     //   if (kyc) {
//     //     user.kycHistory.push(kyc)
//     //     const saved = await user.save()
//     //     console.log(saved)
//     //   }
//     // }
//     // const user = await MC.model.User.findOne({ githubUsername: 'timelytree' })
//     // console.log(user)
//     // user.kyc = null
//     // user.kyc = {
//     //   event: 'success',
//     //   error: {
//     //     name: 'LifeProofValidationFailed',
//     //     message: 'Failed to validate the life proof',
//     //     custom: {
//     //       identifier: 'timelytree'
//     //     }
//     //   }
//     // }
//     // const saved = await user.save()
//     // console.log(saved)
//   } catch (e) {
//     console.log(e)
//   }
// }; kyc()

// //////////////////////////////////////////////////////// lookupHubspotContact
// const Axios = require('axios')
// const lookupHubspotContact = async () => {
//   try {
//     const id = ''
//     const options = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` } }
//     const response = await Axios.get(`https://api.hubapi.com/crm/v3/objects/contacts/${id}`, options)
//     console.log(response)
//   } catch (e) {
//     console.log('============================ [Function: lookupHubspotContact]')
//     console.log(e)
//   }
// }; lookupHubspotContact()
