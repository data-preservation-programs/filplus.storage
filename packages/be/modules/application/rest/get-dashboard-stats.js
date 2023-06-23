console.log('💡 [endpoint] /get-dashboard-stats')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, GetFileFromDisk } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-dashboard-stats', async (req, res) => {
  try {
    const file = await GetFileFromDisk(`${MC.cacheRoot}/application-stats.json`, true)
    if (!file) {
      return SendData(res, 403, 'Something went wrong. Try again.')
    }
    SendData(res, 200, 'Dashboard stats retrieved sucessfully', file)
  } catch (e) {
    console.log('============================= [Endpoint: /get-dashboard-stats')
    console.log(e)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
