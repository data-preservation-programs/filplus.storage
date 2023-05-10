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
        ...(MC.serverFlag !== 'production' && { hs_lead_status: 'Development' })
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

// /////////////////////////////////////////////////////////////// updateContact
const updateContact = async (hubspotOptInContactId, properties) => {
  try {
    const options = { headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` } }
    const response = await Axios.patch(`https://api.hubapi.com/crm/v3/objects/contacts/${hubspotOptInContactId}`, {
      properties
    }, options)
    return response.data
  } catch (e) {
    console.log('=================================== [Function: updateContact]')
    const response = e.response
    console.log(response && response.data ? response.data : e)
    throw e
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (res, user, payload) => {
  try {
    let hubspotOptInContactId = user.hubspotOptInContactId
    let message, userToUpdate
    if (!hubspotOptInContactId) { // if no id, then submit a new contact
      const submission = await submitContact(payload)
      hubspotOptInContactId = submission.id
      message = `✉️  [New] Hubspot contact ${payload.email}|${user._id} submitted with Contact ID → ${hubspotOptInContactId}`
      userToUpdate = {
        _id: user._id,
        hubspotOptIn: true,
        hubspotOptInContactId,
        hubspotOptInFirstName: payload.firstname,
        hubspotOptInLastName: payload.lastname,
        hubspotOptInEmail: payload.email,
        hubspotOptInApplicationCompanyName: payload.company,
        hubspotOptInApplicationRegion: payload.fil__application_region,
        hubspotOptInApplicationDatacapRequested: payload.fil__application_datacap_requested,
        hubspotOptInApplicationWalletAddress: payload.filecoin_wallet_address
      }
    } else { // otherwise, update the existing contact
      await updateContact(hubspotOptInContactId, {
        company: payload.company,
        ...(payload.fil__application_region && { fil__application_region: payload.fil__application_region }), // fil__application_region: payload.fil__application_region,
        fil__application_datacap_requested: payload.fil__application_datacap_requested,
        filecoin_wallet_address: payload.filecoin_wallet_address
      })
      userToUpdate = {
        _id: user._id,
        hubspotOptInApplicationCompanyName: payload.company,
        hubspotOptInApplicationRegion: payload.fil__application_region,
        hubspotOptInApplicationDatacapRequested: payload.fil__application_datacap_requested,
        hubspotOptInApplicationWalletAddress: payload.filecoin_wallet_address
      }
      message = `✉️  [Update] Hubspot contact ${hubspotOptInContactId}|${user._id} updated`
    }
    await UpdateUser(userToUpdate)
    if (MC.serverFlag !== 'production') {
      console.log(message)
    }
  } catch (e) {
    console.log('============================ [Function: submitHubspotContact]')
    throw e
  }
}
