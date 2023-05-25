console.log('💡 [endpoint] /post-kyc-result')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const FindUser = require('@Module_User/logic/find-user')
const UpdateUser = require('@Module_User/logic/update-user')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/post-kyc-result', async (req, res) => {
  try {
    const kyc = req.body
    const githubUsername = kyc.data.identifier
    const user = await FindUser({ githubUsername })
    if (MC.serverEnv === 'stable') {
      console.log(`====================== /post-kyc-result | ${githubUsername}`)
      console.log(kyc)
      console.log(user)
    }
    if (!user) {
      return SendData(res, 403, 'Could not find user associated with token', { token: githubUsername })
    }
    const saved = await UpdateUser({ _id: user._id, kyc })
    MC.socket.io.to(`${saved._id}`).emit('module|kyc-updated|payload', saved)
    SendData(res, 200, 'KYC result recorded successfully', saved)
  } catch (e) {
    console.log('================================ [Endpoint: /post-kyc-result]')
    console.log(e)
    SendData(res, 500, 'Something went wrong. Please try again.')
  }
})
