console.log('💡 [endpoint] /authenticate')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, ThrowError } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/authenticate', (req, res) => {
  const identifier = req.session.identifier
  const guarded = req.query.guarded === 'true'
  try {
    if (identifier) { return SendData(res, 200, 'Authenticated', identifier) }
    if (guarded) { throw ThrowError(403, 'You are not logged in') }
    SendData(res, 200, 'Thou shall pass')
  } catch (e) {
    SendData(res, e.code || 422, e.message || 'Something went wrong, please try logging in again')
  }
})
