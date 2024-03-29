console.log('💡 [endpoint] /get-application-list')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, ParseNumber, ParseQuerySort } = require('@Module_Utilities')
const GetApplicationList = require('@Module_Application/logic/get-application-list')
const GetUser = require('@Module_Application/logic/get-user')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-application-list', async (req, res) => {
  try {
    const query = req.query
    const view = query.view
    const user = await GetUser(req, res, query)
    const page = await ParseNumber(query.page)
    const state = query.state
    const sort = await ParseQuerySort(query.sort)
    const limit = await ParseNumber(query.limit)
    const applicationList = await GetApplicationList(view, user, page, state, limit, sort)
    const results = applicationList.results
    SendData(res, 200, 'Submitted application retrieved succesfully', {
      metadata: {
        page,
        limit,
        count: results.length,
        totalPages: applicationList.metadata.totalPages
      },
      results
    })
  } catch (e) {
    console.log('=========================== [Endpoint: /get-application-list]')
    console.log(e.response)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
