console.log('💡 [endpoint] /')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')

const MC = require('@Root/config')

MC.app.get('/', async (req, res) => {
  try {
    SendData(res, 400, 'No endpoint provided.')
  } catch (e) {
    console.log('================================================ [Endpoint: /')
    console.log(e.response)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
