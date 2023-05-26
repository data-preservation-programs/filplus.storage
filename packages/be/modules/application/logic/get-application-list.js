// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { ParseLinkHeader } = require('@Module_Utilities')
const Axios = require('axios')

const MC = require('@Root/config')

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (view, user, page = 1, state = 'all', limit = 10, sort = 'created') => {
  try {
    const repo = MC.serverFlag === 'production' ? MC.repos[view][0] : MC.repos[view][1]
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
          type: view === 'ga' ? 'GA (General Application)' : 'LDN (Large Dataset Application)'
        }
      })
    }
  } catch (e) {
    console.log('================================= [Logic: GetApplicationList]')
    console.log(e)
    throw e
  }
}
