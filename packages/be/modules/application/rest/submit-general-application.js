console.log('💡 [endpoint] /submit-general-application')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, GetFileFromDisk } = require('@Module_Utilities')

const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/submit-general-application', async (req, res) => {
  const body = req.body
  console.log(body)
  try {
    let template = await GetFileFromDisk(`${MC.staticRoot}/general-application-template.md`)
    template = template.toString()
    console.log(template)
    Object.keys(body).forEach((key) => {
      template = template.replace(key, body[key])
    })
    console.log(template)
    SendData(res, 200, 'General application submitted succesfully', true)
  } catch (e) {
    console.log('===================== [Endpoint: /submit-general-application]')
    console.log(e)
    SendData(res, 403, 'Something went wrong. Try logging in again.')
  }
})
