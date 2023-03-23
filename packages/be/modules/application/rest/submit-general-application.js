console.log('💡 [endpoint] /submit-general-application')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, GetFileFromDisk } = require('@Module_Utilities')
const Axios = require('axios')

const SubmitHubspotContact = require('@Module_Application/logic/submit-hubspot-contact')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////// submitGeneralApplication
const submitGeneralApplication = async (template, body, token) => {
  try {
    const repo = MC.serverFlag === 'production' ? 'filecoin-project/filecoin-plus-client-onboarding' : 'data-preservation-programs/filecoin-plus-client-onboarding'
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.post(`https://api.github.com/repos/${repo}/issues`, {
      title: `Client Allocation Request for: ${body.organization_name}`,
      body: template,
      labels: ['state:Request']
    }, options)
    return response.data
  } catch (e) {
    console.log('======================== [Function: submitGeneralApplication]')
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/submit-general-application', async (req, res) => {
  const body = req.body
  try {
    const identifier = req.session.identifier
    if (!identifier) { return SendData(res, 403, 'You are not logged in') }
    const user = await MC.model.User.findById(identifier.userId)
    let template = await GetFileFromDisk(`${MC.staticRoot}/general-application-template.md`)
    template = template.toString()
    Object.keys(body).forEach((key) => {
      const value = body[key] || ''
      if (key === 'organization_website') {
        template = template.replaceAll(key, value)
      } else {
        template = template.replace(key, value)
      }
    })
    if (MC.serverFlag !== 'production') {
      console.log('===========================================================')
      console.log(body)
      console.log(template)
    }
    const hubspotOptIn = body.hubspot_opt_in
    const hubspotOptInEmail = body.hubspot_opt_in_email
    if (!user.hubspotOptIn && hubspotOptIn && hubspotOptInEmail !== '') {
      await SubmitHubspotContact(user, hubspotOptInEmail)
    }
    const githubIssue = await submitGeneralApplication(template, body, user.githubToken)
    SendData(res, 200, 'General application submitted succesfully', githubIssue)
  } catch (e) {
    console.log('===================== [Endpoint: /submit-general-application]')
    console.log(e.response)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
