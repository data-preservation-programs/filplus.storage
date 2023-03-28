// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Axios = require('axios')

const UpdateUser = require('@Module_User/logic/update-user')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// submitContact
const submitContact = async (payload) => {
  try {
    const options = { headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` } }
    const response = await Axios.post('https://api.hubapi.com/crm/v3/objects/contacts', {
      properties: Object.assign(payload, {
        hubspot_owner_id: MC.serverFlag !== 'production' ? process.env.HUBSPOT_OWNER_ID__Development : process.env.HUBSPOT_OWNER_ID__Production,
        ...(MC.serverFlag !== 'production' && { hs_lead_status: 'Disqualified' })
      })
    }, options)
    return response.data
  } catch (e) {
    console.log('=================================== [Function: submitContact]')
    const response = e.response
    console.log(response && response.data ? response.data : e)
    const error = new Error(`${payload.email} is already in use. Try a different email.`)
    error.code = 422
    throw error
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (res, user, payload) => {
  try {
    const submission = await submitContact(payload)
    const hubspotContactId = submission.id
    if (MC.serverFlag !== 'production') {
      console.log(`✉️  Hubspot contact ${payload.email}|${user._id} submitted with Contact ID → ${hubspotContactId}`)
    }
    await UpdateUser({
      _id: user._id,
      hubspotOptIn: true,
      hubspotOptInFirstName: payload.firstname,
      hubspotOptInLastName: payload.lastname,
      hubspotOptInEmail: payload.email,
      hubspotOptInApplicationCompanyName: payload.company,
      hubspotOptInApplicationRegion: payload.fil__application_region,
      hubspotOptInApplicationDatacapRequested: payload.fil__application_datacap_requested,
      hubspotOptInApplicationWalletAddress: payload.filecoin_wallet_address
    })
  } catch (e) {
    console.log('============================ [Function: submitHubspotContact]')
    throw e
  }
}
