console.log('💡 [endpoint] /submit-large-application')

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
    const repo = MC.serverFlag === 'production' ? 'filecoin-project/filecoin-plus-large-datasets' : 'xinaxu/filecoin-plus-large-datasets'
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN_2}` } }
    const response = await Axios.post(`https://api.github.com/repos/${repo}/issues`, {
      title: `[DataCap Application] ${body.organization_name}`,
      body: template
    }, options)
    return response.data.html_url
  } catch (e) {
    console.log('=============================== [Function: submitApplication]')
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/submit-large-application', async (req, res) => {
  const body = req.body
  try {
    let template = await GetFileFromDisk(`${MC.staticRoot}/large-application-template.md`)
    template = template.toString()
    Object.keys(body).forEach((key) => {
      if (key === 'organization_website') {
        template = template.replaceAll(key, body[key])
      } else if (key === 'github_handle') {
        template = template.replace(key, `@${body[key].replace('@', '')}`)
      } else {
        template = template.replace(key, body[key])
      }
    })
    if (MC.serverFlag !== 'production') {
      console.log('===========================================================')
      console.log(body)
      console.log(template)
    }
    let githubIssueLink = '/'
    if (MC.serverFlag === 'production') {
      githubIssueLink = await submitApplication(template, body)
    }
    SendData(res, 200, 'Large application submitted succesfully', githubIssueLink)
  } catch (e) {
    console.log('======================= [Endpoint: /submit-large-application]')
    console.log(e.response)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
