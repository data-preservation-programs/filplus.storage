// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { ParseLinkHeader } = require('@Module_Utilities')
const Axios = require('axios')
const DetermineApplicationState = require('@Module_Application/logic/determine-application-state')

const MC = require('@Root/config')

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (view, user, page = 1, state = 'all', limit = 10, sort = 'created') => {
  try {
    const repo = MC.repos[view][MC.serverFlag]
    const options = {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${user.githubToken}` },
      params: {
        creator: user.githubUsername,
        ...(state && { state }),
        ...(page && { page }),
        ...(limit && { per_page: limit }),
        sort,
        direction: sort.created === 1 ? 'asc' : 'desc'
      }
    }
    const response = await Axios.get(`https://api.github.com/repos/${repo}/issues`, options)
    return {
      metadata: await ParseLinkHeader(response.headers.link, response.data),
      results: response.data.map((application) => {
        return {
          ...application,
          type: view === 'ga' ? 'GA (General Application)' : 'LDN (Large Dataset Application)',
          application_state: DetermineApplicationState(application.labels.map(label => (label.name)), view)
        }
      })
    }
  } catch (e) {
    console.log('================================= [Logic: GetApplicationList]')
    console.log(e)
    throw e
  }
}
