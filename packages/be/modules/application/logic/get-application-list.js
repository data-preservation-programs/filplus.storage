// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { ParseLinkHeader } = require('@Module_Utilities')
const Axios = require('axios')

const MC = require('@Root/config')

const repos = {
  ga: ['filecoin-project/filecoin-plus-client-onboarding', 'data-preservation-programs/filecoin-plus-client-onboarding'],
  lda: ['filecoin-project/filecoin-plus-large-datasets', 'data-preservation-programs/filecoin-plus-large-datasets']
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (view, user, page = 1, state = 'all', limit = 10, sort = 'created') => {
  try {
    const repo = MC.serverFlag === 'production' ? repos[view][0] : repos[view][1]
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
