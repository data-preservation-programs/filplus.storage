console.log('💡 [endpoint] /post-webhook-issue')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
// const FindUser = require('@Module_User/logic/find-user')
// const UpdateUser = require('@Module_User/logic/update-user')

const MC = require('@Root/config')
// const serverFlag = MC.serverFlag

const processLabels = (labels) => {
  if (labels.length === 0) { return [] }
  return labels
    .map(label => (label.name.toLowerCase()))
    .sort()
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/post-webhook-issue', async (req, res) => {
  try {
    const incoming = req.body
    const issue = incoming.issue
    const labels = processLabels(issue.labels)
    const githubUsername = issue.user.login
    console.log(`=========================================== ${githubUsername}`)
    const created = await MC.model.ApplicationChangedQueue.create({
      githubUsername,
      labels
    })
    console.log(created)
    SendData(res, 200, 'Github issue webhook recorded successfully')
  } catch (e) {
    console.log('============================= [Endpoint: /post-webhook-issue]')
    console.log(e)
    SendData(res, 500, 'Something went wrong. Please try again.')
  }
})
