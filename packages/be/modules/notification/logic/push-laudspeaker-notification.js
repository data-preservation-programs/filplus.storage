// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Axios = require('axios')
const Path = require('path')

require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (event, githubUsername, email, failureMessage = false) => {
  console.log('🚀')
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Api-Key ${process.env.LAUDSPEAKER_API_TOKEN}`
      }
    }
    const upsertData = {
      correlationKey: 'email',
      correlationValue: email,
      githubUsername,
      kycStatus: event
    }
    const eventData = {
      correlationKey: 'email',
      correlationValue: email,
      source: 'custom',
      event: `kyc-${event}`
    }
    if (failureMessage) { upsertData.failureMessage = failureMessage }
    await Axios.post('https://api.laudspeaker.com/customers/upsert', upsertData, options)
      .then(async () => {
        await Axios.post('https://api.laudspeaker.com/events', eventData, options)
      })
  } catch (e) {
    console.log('=========================[Logic: PushLaudspeakerNotification]')
    console.log(e)
  }
}
