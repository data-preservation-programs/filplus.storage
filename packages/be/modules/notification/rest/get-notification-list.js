console.log('💡 [endpoint] /get-notification-list')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, ThrowError, ParseNumber } = require('@Module_Utilities')
const GetNotificationList = require('@Module_Notification/queries/get-notification-list')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// --------------------------------------------------------------------- process
const process = async (data) => {
  const response = data[0]
  // .................................................. metadata when no results
  if (!response.hasOwnProperty('metadata')) {
    response.metadata = {
      totalPages: 1
    }
  }
  return response
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-notifications-list', async (req, res) => {
  try {
    const query = req.query
    const identifier = req.session.identifier
    if (!identifier) { throw ThrowError(200, 'You are not logged in') }
    const page = await ParseNumber(query.page)
    const limit = 10
    const notifications = await process(
      await MC.model.Notification.aggregate(
        GetNotificationList(page, limit, identifier.userId)
      )
    )
    SendData(res, 200, 'Notifications retrieved succesfully', notifications)
  } catch (e) {
    if (e.code !== 200) {
      console.log('======================== [Endpoint: /get-notification-list]')
      console.log(e)
    }
    SendData(res, e.code || 422, e.message || 'Something went wrong, please try logging in again', { results: [], metadata: { totalPages: 1 } })
  }
})
