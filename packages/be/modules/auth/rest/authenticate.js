console.log('💡 [endpoint] /authenticate')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/authenticate', (req, res) => {
  const identifier = req.session.identifier
  const guarded = req.query.guarded === 'true'
  try {
    if (identifier) { return SendData(res, 200, 'Authenticated', identifier) }
    SendData(res, guarded ? 403 : 200, 'You are not logged in', false)
  } catch (e) {
    console.log('=================================== [Endpoint: /authenticate]')
    console.log(e)
    SendData(res, 422, 'Something went wrong, please try logging in again')
  }
})
