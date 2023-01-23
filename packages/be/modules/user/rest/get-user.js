console.log('💡 [endpoint] /get-user')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const FindUser = require('@Module_User/logic/find-user')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-user', async (req, res) => {
  const userId = req.query.userId
  try {
    const user = await FindUser({ _id: userId }, '-githubToken')
    if (!user) { return SendData(res, 403, 'Something went wrong. Try logging in again.') }
    SendData(res, 200, 'User retrieved succesfully', user)
  } catch (e) {
    console.log('======================================= [Endpoint: /get-user]')
    console.log(e)
    SendData(res, 403, 'Something went wrong. Try logging in again.')
  }
})
