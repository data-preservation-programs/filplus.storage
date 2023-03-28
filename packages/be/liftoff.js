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
// const users = async () => {
//   try {
//     const user = await MC.model.User.findOne({ githubUsername: 'timelytree' })
//     console.log(user)
//     // user.hubspotOptIn = false
//     // user.hubspotOptInContactId = undefined
//     // user.hubspotOptInEmail = undefined
//     // user.hubspotOptInFirstName = undefined
//     // user.hubspotOptInLastName = undefined
//     // user.hubspotOptInApplicationCompanyName = undefined
//     // user.hubspotOptInApplicationRegion = undefined
//     // user.hubspotOptInApplicationDatacapRequested = undefined
//     // user.hubspotOptInApplicationWalletAddress = undefined
//     // await user.save()
//     // console.log(saved)
//   } catch (e) {
//     console.log(e)
//   }
//
//   // try {
//   //   const user = await MC.model.User.deleteOne({ githubUsername: 'timelytree' })
//   //   console.log(user)
//   // } catch (e) {
//   //   console.log(e)
//   // }
//
//   // try {
//   //   const users = await MC.model.User.find()
//   //   const len = users.length
//   //   for (let i = 0; i < len; i++) {
//   //     const user = users[i]
//   //     // const beforeEmail = `${user.email}`
//   //     console.log(user)
//   //     // user.githubEmail = user.email === '' ? null : user.email
//   //     // user.email = null
//   //     // const saved = await user.save()
//   //     // console.log(saved)
//   //     // console.log(`Before: ${beforeEmail} | After: ${saved.githubEmail}`)
//   //   }
//   // } catch (e) {
//   //   console.log(e)
//   // }
// }; users()

// //////////////////////////////////////////////////////// lookupHubspotContact
// const Axios = require('axios')
// const lookupHubspotContact = async () => {
//   try {
//     const id = '3049751'
//     const options = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` } }
//     const response = await Axios.get(`https://api.hubapi.com/crm/v3/objects/contacts/${id}`, options)
//     console.log(response)
//   } catch (e) {
//     console.log('============================ [Function: lookupHubspotContact]')
//     console.log(e)
//   }
// }; lookupHubspotContact()
