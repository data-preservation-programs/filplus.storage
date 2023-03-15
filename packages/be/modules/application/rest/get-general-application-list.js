console.log('💡 [endpoint] /get-general-application-list')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, ParseNumber } = require('@Module_Utilities')
const GetGeneralApplicationList = require('@Module_Application/logic/get-general-application-list')
const SortApplications = require('@Module_Application/logic/sort-applications')
const GetUser = require('@Module_Application/logic/get-user')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-general-application-list', async (req, res) => {
  try {
    const query = req.query
    const user = await GetUser(req, query)
    const page = await ParseNumber(query.page)
    const state = query.state
    const sort = query.sort
    const limit = await ParseNumber(query.limit)
    const applicationList = await GetGeneralApplicationList(user, page, state, limit)
    const results = applicationList.results
    await SortApplications(results, sort)
    SendData(res, 200, 'GA list retrieved succesfully', {
      metadata: {
        page,
        limit,
        count: results.length,
        totalPages: applicationList.metadata.totalPages
      },
      results
    })
  } catch (e) {
    console.log('============= [Endpoint: /get-general-application-list]')
    console.log(e.response)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
