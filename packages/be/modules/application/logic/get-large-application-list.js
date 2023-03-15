// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { ParseLinkHeader } = require('@Module_Utilities')
const Axios = require('axios')

const MC = require('@Root/config')

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (user, page = 1, state = 'all', limit = 10) => {
  try {
    const repo = MC.serverFlag === 'production' ? 'filecoin-project/filecoin-plus-large-datasets' : 'data-preservation-programs/filecoin-plus-large-datasets'
    const options = {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${user.githubToken}` },
      params: {
        creator: user.githubUsername,
        ...(state && { state }),
        ...(page && { page }),
        ...(limit && { per_page: limit })
      }
    }
    const response = await Axios.get(`https://api.github.com/repos/${repo}/issues`, options)
    return {
      metadata: await ParseLinkHeader(response.headers.link, response.data),
      results: response.data.map((application) => {
        return {
          ...application,
          type: 'LDA (Large Dataset Application)'
        }
      })
    }
  } catch (e) {
    console.log('============================ [Logic: GetLargeApplicationList]')
    throw e
  }
}
