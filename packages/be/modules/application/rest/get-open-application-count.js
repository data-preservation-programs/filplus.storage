console.log('💡 [endpoint] /get-open-application-count')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, ThrowError } = require('@Module_Utilities')
const GetApplicationList = require('@Module_Application/logic/get-application-list')
const FindUser = require('@Module_User/logic/find-user')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-open-application-count', async (req, res) => {
  try {
    const identifier = req.session.identifier
    if (!identifier) { throw ThrowError(403, 'You are not logged in') }
    const query = req.query
    const view = query.view
    const user = await FindUser({ _id: identifier.userId })
    if (!user) { throw ThrowError(403, 'Something went wrong. Try logging in again.') }
    const applicationList = await GetApplicationList(view, user, false, 'open', 100, false)
    const count = applicationList.results.length
    SendData(res, 200, 'Open application count retrieved succesfully', count > 0 ? count : false)
  } catch (e) {
    console.log('===================== [Endpoint: /get-open-application-count]')
    console.log(e)
    SendData(res, e.code || 422, e.message || 'Something went wrong, please try logging in again')
  }
})
