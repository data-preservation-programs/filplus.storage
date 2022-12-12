console.log('💡 [endpoint] /submit-general-application')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, GetFileFromDisk } = require('@Module_Utilities')
const Axios = require('axios')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////// submitApplication
const submitApplication = async (template, body) => {
  try {
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN_2}` } }
    const response = await Axios.post('https://api.github.com/repos/filecoin-project/filecoin-plus-client-onboarding/issues', JSON.stringify({
      title: `Client Allocation Request for: ${body.organization_name}`,
      body: template,
      labels: [
        'state:Request'
      ]
    }), options)
    console.log(response)
  } catch (e) {
    console.log('=============================== [Function: submitApplication]')
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/submit-general-application', async (req, res) => {
  const body = req.body
  try {
    let template = await GetFileFromDisk(`${MC.staticRoot}/general-application-template.md`)
    template = template.toString()
    Object.keys(body).forEach((key) => {
      template = template.replace(key, body[key])
    })
    console.log('=============================================================')
    console.log(template)
    await submitApplication(template, body)
    SendData(res, 200, 'General application submitted succesfully', true)
  } catch (e) {
    console.log('===================== [Endpoint: /submit-general-application]')
    console.log(e)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
