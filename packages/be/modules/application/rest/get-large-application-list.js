console.log('💡 [endpoint] /get-large-application-list')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, ParseNumber } = require('@Module_Utilities')
const GetLargeApplicationList = require('@Module_Application/logic/get-large-application-list')
const SortApplications = require('@Module_Application/logic/sort-applications')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-large-application-list', async (req, res) => {
  try {
    const identifier = req.session.identifier
    if (!identifier) { return SendData(res, 403, 'You are not logged in') }
    const user = await MC.model.User.findById(identifier.userId)
    const query = req.query
    const page = await ParseNumber(query.page)
    const state = query.state
    const sort = query.sort
    const limit = await ParseNumber(query.limit)
    const applicationList = await GetLargeApplicationList(user.githubUsername, user.githubToken, page, state, limit)
    const results = applicationList.results
    await SortApplications(results, sort)
    SendData(res, 200, 'LDA list retrieved succesfully', {
      metadata: {
        page,
        limit,
        count: results.length,
        totalPages: applicationList.metadata.totalPages
      },
      results
    })
  } catch (e) {
    console.log('=============== [Endpoint: /get-large-application-list]')
    console.log(e.response)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
