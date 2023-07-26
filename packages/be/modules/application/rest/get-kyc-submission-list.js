console.log('💡 [endpoint] /get-kyc-submission-list')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, ThrowError } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-kyc-submission-list', async (req, res) => {
  try {
    const params = req.query
    const token = req.query.token
    if (!token || token === '' || token !== process.env.GET_KYC_SUBMISSION_LIST_TOKEN) {
      throw ThrowError(401, 'Please provide the correct token in the params: ?token=<token>')
    }
    const list = await MC.model.User
      .find({ kyc: { $ne: null } })
      .select({
        githubUsername: 1,
        'kyc.event': 1,
        'kyc.error': 1,
        'kyc.data.kyc.createdAt': 1,
        'kyc.data.kyc.custom': 1
      })
    SendData(res, 200, 'Open application count retrieved succesfully', list)
  } catch (e) {
    if (process.serverFlag !== 'production') {
      console.log('====================== [Endpoint: /get-kyc-submission-list]')
      console.log(e)
    }
    SendData(res, e.code || 422, e.message || 'Something went wrong, please try logging in again')
  }
})
