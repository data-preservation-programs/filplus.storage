console.log('💡 [endpoint] /submit-application')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, GetFileFromDisk } = require('@Module_Utilities')
const Axios = require('axios')

const MC = require('@Root/config')

const repos = {
  'ga': ['filecoin-project/filecoin-plus-client-onboarding', 'data-preservation-programs/filecoin-plus-client-onboarding'],
  'lda': ['filecoin-project/filecoin-plus-large-datasets', 'data-preservation-programs/filecoin-plus-large-datasets']
}

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////// submitApplication
const submitApplication = async (type, template, application, token) => {
  try {
    const repo = MC.serverFlag === 'production' ? repos[type][0] : repos[type][1]
    const body = type === 'ga' ? {
      title: `Client Allocation Request for: ${application.organization_name}`,
      body: template,
      labels: ['state:Request']
    } : {
      title: `[DataCap Application] ${application.organization_name}`,
      body: template
    }
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.post(`https://api.github.com/repos/${repo}/issues`, body, options)
    return response.data
  } catch (e) {
    console.log('=============================== [Function: submitApplication]')
    throw e
  }
}

// ///////////////////////////////////////////////////////////// processTemplate
const processTemplate = async (type, application) => {
  try {
    let template = await GetFileFromDisk(`${MC.staticRoot}/${type}-template.md`)
    template = template.toString()
    Object.keys(application).forEach((key) => {
      const value = application[key] || ''
      if (key === 'organization_website') {
        template = template.replaceAll(key, value)
      } else {
        template = template.replace(key, value)
      }
    })
    return template
  } catch (e) {
    console.log('================================= [Function: processTemplate]')
    console.log(e)
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/submit-application', async (req, res) => {
  const application = req.body
  const type = req.query.type
  try {
    if (!type || type === '') { return SendData(res, 403, 'Something went wrong. Try again.') }
    const identifier = req.session.identifier
    if (!identifier) { return SendData(res, 403, 'You are not logged in') }
    const user = await MC.model.User.findById(identifier.userId)
    const template = await processTemplate(type, application)
    if (MC.serverFlag !== 'production') {
      console.log('===========================================================')
      console.log(application)
      console.log(template)
    }
    const githubIssue = await submitApplication(type, template, application, user.githubToken)
    SendData(res, 200, 'Application submitted succesfully', githubIssue)
  } catch (e) {
    console.log('============================= [Endpoint: /submit-application]')
    console.log(e.response)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
