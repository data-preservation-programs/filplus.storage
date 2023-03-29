console.log('💡 [endpoint] /login')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const Github = require('@Module_Auth/strategies/github')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/login', async (req, res) => {
  const query = req.query
  const tempToken = query.token
  const strategy = query.strategy
  try {
    if (!tempToken || tempToken === '' || !strategy || strategy === '') {
      return SendData(res, 422, 'GitHub OAuth Token is missing')
    }
    let session
    switch (strategy) {
      case 'github': session = await Github(req, tempToken); break
    }
    SendData(res, 200, 'You are now logged in', session)
  } catch (e) {
    console.log('======================================= [Endpoint: /login]')
    console.log(e)
    SendData(res, 422, 'Something went wrong, please try logging in again')
  }
})
