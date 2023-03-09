console.log('💡 [endpoint] /get-general-application-list')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const Axios = require('axios')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////// parseNumber
const parseNumber = (page) => {
  return new Promise((resolve) => {
    const parsed = parseInt(page)
    resolve(isNaN(parsed) ? 1 : parsed)
  })
}

// /////////////////////////////////////////////////// getGeneralApplicationList
const getGeneralApplicationList = async (username, token, page, state, perPage) => {
  try {
    console.log('getGeneralApplicationList ', perPage)
    const repo = MC.serverFlag === 'production' ? 'filecoin-project/filecoin-plus-large-datasets' : 'data-preservation-programs/filecoin-plus-client-onboarding'
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.get(`https://api.github.com/repos/${repo}/issues?state=${state}&creator=${username}&per_page=${perPage}`, options)
    return response.data
  } catch (e) {
    console.log('================= [Function: getSubmittedGeneralApplications]')
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-general-application-list', async (req, res) => {
  try {
    const identifier = req.session.identifier
    if (!identifier) { return SendData(res, 403, 'You are not logged in') }
    const user = await MC.model.User.findById(identifier.userId)
    if (MC.serverFlag !== 'production') {
      console.log('=============================================== development')
    }
    const query = req.query
    const page = await parseNumber(query.page)
    const state = await query.state
    const perPage = await parseNumber(query.perPage)
    const generalApplicationList = await getGeneralApplicationList(user.githubUsername, user.githubToken, page, state, perPage)
    SendData(res, 200, 'Submitted application retrieved succesfully', generalApplicationList)
  } catch (e) {
    console.log('============= [Endpoint: /get-general-application-list]')
    console.log(e.response)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
