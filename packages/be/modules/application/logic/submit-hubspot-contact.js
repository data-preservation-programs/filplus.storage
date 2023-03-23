// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Axios = require('axios')

const UpdateUser = require('@Module_User/logic/update-user')

const MC = require('@Root/config')

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (user, hubspotOptInEmail) => {
  try {
    const options = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` } }
    const response = await Axios.post('https://api.hubapi.com/crm/v3/objects/contacts', {
      email: hubspotOptInEmail
    }, options)
    if (MC.serverFlag !== 'production') {
      console.log(`✉️  Hubspot contact ${hubspotOptInEmail}|${user._id} submitted with ID → ${response.data.id}`)
    }
    await UpdateUser({
      _id: user._id,
      hubspotOptIn: true,
      hubspotOptInEmail
    })
  } catch (e) {
    console.log('============================ [Function: submitHubspotContact]')
    console.log(e)
  }
}
