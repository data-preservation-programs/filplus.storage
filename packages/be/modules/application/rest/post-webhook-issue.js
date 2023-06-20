console.log('💡 [endpoint] /post-webhook-issue')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
// const FindUser = require('@Module_User/logic/find-user')
// const UpdateUser = require('@Module_User/logic/update-user')

const MC = require('@Root/config')
// const serverFlag = MC.serverFlag

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/post-webhook-issue', async (req, res) => {
  try {
    const issue = req.body.issue
    const labels = issue.labels
    console.log(labels)
    SendData(res, 200, 'Github issue webhook recorded successfully', req.body)
  } catch (e) {
    console.log('============================= [Endpoint: /post-webhook-issue]')
    console.log(e)
    SendData(res, 500, 'Something went wrong. Please try again.')
  }
})
