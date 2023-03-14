console.log('💡 [endpoint] /get-application-list')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, ParseNumber } = require('@Module_Utilities')
const GetGeneralApplicationList = require('@Module_Application/logic/get-general-application-list')
const GetLargeApplicationList = require('@Module_Application/logic/get-large-application-list')
const SortApplications = require('@Module_Application/logic/sort-applications')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-application-list', async (req, res) => {
  try {
    const identifier = req.session.identifier
    if (!identifier) { return SendData(res, 403, 'You are not logged in') }
    const user = await MC.model.User.findById(identifier.userId)
    const query = req.query
    const page = await ParseNumber(query.page)
    const state = query.state
    const sort = query.sort
    const limit = await ParseNumber(query.limit)
    const generalApplicationList = await GetGeneralApplicationList(user.githubUsername, user.githubToken, page, state, limit)
    const largeApplicationList = await GetLargeApplicationList(user.githubUsername, user.githubToken, page, state, limit)
    const results = generalApplicationList.results.concat(largeApplicationList.results)
    await SortApplications(results, sort)
    SendData(res, 200, 'Submitted application retrieved succesfully', {
      metadata: {
        page,
        limit,
        count: results.length,
        totalPages: Math.max(generalApplicationList.metadata.totalPages, largeApplicationList.metadata.totalPages)
      },
      results
    })
  } catch (e) {
    console.log('=========================== [Endpoint: /get-application-list]')
    console.log(e.response)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
