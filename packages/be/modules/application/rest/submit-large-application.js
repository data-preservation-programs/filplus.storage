console.log('💡 [endpoint] /submit-large-application')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, GetFileFromDisk } = require('@Module_Utilities')
// const Axios = require('axios')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////// submitApplication
// const submitApplication = async (template, body) => {
//   try {
//     const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN_2}` } }
//     await Axios.post('https://api.github.com/repos/xinaxu/filecoin-plus-large-datasets/issues', JSON.stringify({
//       title: `[DataCap Application] ${body.organization_name}`,
//       body: template
//     }), options)
//     return true
//   } catch (e) {
//     console.log('=============================== [Function: submitApplication]')
//     throw e
//   }
// }

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/submit-large-application', async (req, res) => {
  const body = req.body
  // console.log(body)
  try {
    let template = await GetFileFromDisk(`${MC.staticRoot}/large-application-template.md`)
    template = template.toString()
    Object.keys(body).forEach((key) => {
      if (key === 'organization_website') {
        template = template.replaceAll(key, body[key])
      } else {
        template = template.replace(key, body[key])
      }
    })
    // console.log('=============================================================')
    // console.log(template)
    // await submitApplication(template, body)
    SendData(res, 200, 'Large application submitted succesfully', true)
  } catch (e) {
    console.log('======================= [Endpoint: /submit-large-application]')
    console.log(e.response)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
