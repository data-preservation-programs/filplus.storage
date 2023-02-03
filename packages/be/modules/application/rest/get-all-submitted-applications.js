console.log('💡 [endpoint] /get-all-submitted-applications')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const Axios = require('axios')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////// getSubmittedGeneralApplications
const getSubmittedGeneralApplications = async (username, options) => {
  try {
    const repo = MC.serverFlag === 'production' ? 'filecoin-project/filecoin-plus-large-datasets' : 'data-preservation-programs/filecoin-plus-client-onboarding'
    const response = await Axios.get(`https://api.github.com/repos/${repo}/issues?creator=${username}&state=all&per_page=100`, options)
    return response.data
  } catch (e) {
    console.log('================= [Function: getSubmittedGeneralApplications]')
    throw e
  }
}

// /////////////////////////////////////////////// getSubmittedLargeApplications
const getSubmittedLargeApplications = async (username, options) => {
  try {
    const repo = MC.serverFlag === 'production' ? 'filecoin-project/filecoin-plus-large-datasets' : 'data-preservation-programs/filecoin-plus-large-datasets'
    const response = await Axios.get(`https://api.github.com/repos/${repo}/issues?creator=${username}&state=all&per_page=100`, options)
    return response.data
  } catch (e) {
    console.log('=================== [Function: getSubmittedLargeApplications]')
    throw e
  }
}

// ////////////////////////////////////////////////////////// processApplicationList

const processApplicationList = (applicationList, applicationType) => {
  try {
    return applicationList.map((application) => {
      return {
        ...application,
        application_type: applicationType
      }
    })
  } catch (e) {
    console.log('============================== [Function: processApplicationList]')
    throw e
  }
}

// //////////////////////////////////////////////// mergeApplicationLists

const mergeApplicationLists = (gaApplications, ldaApplications) => {
  try {
    const generalApplicationList = processApplicationList(gaApplications, 'general')
    const largeApplicationList = processApplicationList(ldaApplications, 'large')
    const allApplications = [...generalApplicationList, ...largeApplicationList]

    return allApplications
  } catch (e) {
    console.log('==================== [Function: mergeApplicationLists]')
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-all-submitted-applications', async (req, res) => {
  try {
    const identifier = req.session.identifier
    if (!identifier) { return SendData(res, 403, 'You are not logged in') }
    const user = await MC.model.User.findById(identifier.userId)
    if (MC.serverFlag !== 'production') {
      console.log('=============================================== development')
    }
    const githubOptions = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${user.githubToken}` } }
    const gaApplications = await getSubmittedGeneralApplications(user.githubUsername, githubOptions)
    const ldaApplications = await getSubmittedLargeApplications(user.githubUsername, githubOptions)

    const sortedApplications = mergeApplicationLists(gaApplications, ldaApplications)

    SendData(res, 200, 'Submitted application retrieved succesfully', sortedApplications)
  } catch (e) {
    console.log('=============== [Endpoint: /get-all-submitted-applications]')
    console.log(e)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
