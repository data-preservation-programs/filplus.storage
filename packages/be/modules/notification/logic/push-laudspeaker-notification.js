// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Axios = require('axios')
const Path = require('path')

require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (eventData, upsertData = false) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Api-Key ${process.env.LAUDSPEAKER_API_TOKEN}`
      }
    }
    if (upsertData) {
      await Axios.post('https://api.laudspeaker.com/customers/upsert', upsertData, options)
        .then(async () => {
          await Axios.post('https://api.laudspeaker.com/events', eventData, options)
        })
    } else {
      await Axios.post('https://api.laudspeaker.com/events', eventData, options)
    }
  } catch (e) {
    console.log('=========================[Logic: PushLaudspeakerNotification]')
    console.log(e)
  }
}
