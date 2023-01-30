console.log('💡 [endpoint] /get-submitted-applications')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const Axios = require('axios')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////// submitApplication
const getSubmittedApplications = async (username, token) => {
  try {
    const repo = MC.serverFlag === 'production' ? 'filecoin-project/filecoin-plus-large-datasets' : 'data-preservation-programs/filecoin-plus-client-onboarding'
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.get(`https://api.github.com/repos/${repo}/issues?creator=${username}`, options)
    return response.data
  } catch (e) {
    console.log('======================== [Function: getSubmittedApplications]')
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-submitted-applications', async (req, res) => {
  try {
    const identifier = req.session.identifier
    if (!identifier) { return SendData(res, 403, 'You are not logged in') }
    const user = await MC.model.User.findById(identifier.userId)
    if (MC.serverFlag !== 'production') {
      console.log('=============================================== development')
    }
    const submittedApplications = await getSubmittedApplications(user.githubUsername, user.githubToken)
    SendData(res, 200, 'Submitted application retrieved succesfully', submittedApplications)
  } catch (e) {
    console.log('===================== [Endpoint: /get-submitted-applications]')
    console.log(e.response)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
