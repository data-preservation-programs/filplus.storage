console.log('💡 [endpoint] /submit-general-application')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, GetFileFromDisk } = require('@Module_Utilities')
const FindUsers = require('@Module_User/logic/find-users')

const MC = require('@Root/config')

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
    SendData(res, 200, 'User list retrieved succesfully', true)
  } catch (e) {
    console.log('===================== [Endpoint: /submit-general-application]')
    console.log(e)
    SendData(res, 403, 'Something went wrong. Try logging in again.')
  }
})
