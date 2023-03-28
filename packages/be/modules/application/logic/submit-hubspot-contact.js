// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Axios = require('axios')

const UpdateUser = require('@Module_User/logic/update-user')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// submitContact
const submitContact = async (email, firstname, lastname) => {
  try {
    const options = { headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` } }
    const response = await Axios.post('https://api.hubapi.com/crm/v3/objects/contacts', {
      properties: {
        email,
        firstname,
        lastname,
        hubspot_owner_id: process.env.HUBSPOT_OWNER_ID
      }
    }, options)
    return response.data
  } catch (e) {
    console.log('=================================== [Function: submitContact]')
    const error = new Error(`${email} is already in use. Try a different email.`)
    error.code = 422
    throw error
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (res, user, email, firstName, lastName) => {
  try {
    const submission = await submitContact(email, firstName, lastName)
    const hubspotContactId = submission.id
    if (MC.serverFlag !== 'production') {
      console.log(`✉️  Hubspot contact ${email}|${user._id} submitted with Contact ID → ${hubspotContactId}`)
    }
    await UpdateUser({
      _id: user._id,
      hubspotOptIn: true,
      hubspotOptInEmail: email,
      hubspotOptInFirstName: firstName,
      hubspotOptInLastName: lastName
    })
  } catch (e) {
    console.log('============================ [Function: submitHubspotContact]')
    throw e
  }
}
