console.log('💡 [endpoint] /post-kyc-result')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const FindUser = require('@Module_User/logic/find-user')
const UpdateUser = require('@Module_User/logic/update-user')

const MC = require('@Root/config')
const serverFlag = MC.serverFlag

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/post-kyc-result', async (req, res) => {
  try {
    if (serverFlag === 'stable') {
      console.log('========================================== /post-kyc-result')
      console.log(req.body)
    }
    const body = req.body
    let data = body.data
    if (!data || data === '') {
      return SendData(res, 422, '<data> key is missing')
    }
    data = data.custom
    const githubUsername = data.identifier
    if (!githubUsername || githubUsername === '') {
      return SendData(res, 422, '<identifier> param is missing')
    }
    const env = data.environment
    if (!env || env === '') {
      data.environment = serverFlag
    }
    const user = await FindUser({ githubUsername })
    if (!user) {
      return SendData(res, 422, 'Could not find user associated with <identifier>', { identifier: githubUsername })
    }
    const saved = await UpdateUser({ _id: user._id, kyc: req.body })
    MC.socket.io.to(`${saved._id}`).emit('module|kyc-updated|payload', saved)
    SendData(res, 200, 'KYC result recorded successfully', saved)
  } catch (e) {
    console.log('================================ [Endpoint: /post-kyc-result]')
    console.log(e)
    SendData(res, 500, 'Something went wrong. Please try again.')
  }
})
