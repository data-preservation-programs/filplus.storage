console.log('💡 [endpoint] /get-submitted-large-applications')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const Axios = require('axios')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////// getSubmittedLargeApplications
const getSubmittedLargeApplications = async (username, token) => {
  try {
    const repo = MC.serverFlag === 'production' ? 'filecoin-project/filecoin-plus-large-datasets' : 'data-preservation-programs/filecoin-plus-large-datasets'
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.get(`https://api.github.com/repos/${repo}/issues?creator=${username}`, options)
    return response.data
  } catch (e) {
    console.log('=================== [Function: getSubmittedLargeApplications]')
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-submitted-large-applications', async (req, res) => {
  try {
    const identifier = req.session.identifier
    if (!identifier) { return SendData(res, 403, 'You are not logged in') }
    const user = await MC.model.User.findById(identifier.userId)
    if (MC.serverFlag !== 'production') {
      console.log('=============================================== development')
    }
    const submittedApplications = await getSubmittedLargeApplications(user.githubUsername, user.githubToken)
    SendData(res, 200, 'Submitted application retrieved succesfully', submittedApplications)
  } catch (e) {
    console.log('=============== [Endpoint: /get-submitted-large-applications]')
    console.log(e.response)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})