console.log('💡 [endpoint] /post-webhook-issue')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const DetermineApplicationState = require('@Module_Application/logic/determine-application-state')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// processLabels
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
    const githubUsername = issue.user.login
    console.log(`=========================================== ${githubUsername}`)
    const labels = processLabels(issue.labels)
    const state = await DetermineApplicationState(labels)
    if (state !== 'noRelevantLabels') {
      const created = await MC.model.ApplicationChangedQueue.create({
        githubUsername,
        issueId: issue.id,
        issueNumber: issue.number,
        issueTitle: issue.title,
        state,
        labels
      })
      console.log(created)
    } else {
      console.log('Issue not part of pipeline')
    }
    SendData(res, 200, 'Github issue webhook recorded successfully')
  } catch (e) {
    console.log('============================= [Endpoint: /post-webhook-issue]')
    console.log(e)
    SendData(res, 500, 'Something went wrong. Please try again.')
  }
})
