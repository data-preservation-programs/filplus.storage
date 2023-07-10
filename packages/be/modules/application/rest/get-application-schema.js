console.log('💡 [endpoint] /get-application-schema')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData, GetFileFromDisk } = require('@Module_Utilities')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// processSchema
const processSchema = (file) => {
  return new Promise((resolve) => {
    const application = file.applicationInfo
    const sections = Object.keys(application)
    const compiled = {}
    const len = sections.length
    for (let i = 0; i < len; i++) {
      const section = application[sections[i]]
      Object.keys(section).forEach((sectionKey) => {
        const value = section[sectionKey]
        if (typeof value === 'object') {
          Object.keys(value).forEach((valueKey) => {
            compiled[`${sectionKey}||${valueKey}`] = null
          })
        } else {
          compiled[sectionKey] = null
        }
      })
    }
    resolve(compiled)
  })
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-application-schema', async (req, res) => {
  try {
    const file = await GetFileFromDisk(`${MC.cacheRoot}/application-schema.json`, true)
    if (!file) {
      return SendData(res, 403, 'Something went wrong. Try again.')
    }
    SendData(res, 200, 'Dashboard stats retrieved sucessfully', await processSchema(file))
  } catch (e) {
    console.log('========================== [Endpoint: /get-application-schema')
    console.log(e)
    SendData(res, 403, 'Something went wrong. Try again.')
  }
})
