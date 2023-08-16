
console.log('💡 [endpoint] /get-kyc-users')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')
const FindKycUsers = require('@Module_User/logic/find-kyc-users')

const Papa = require('papaparse')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ------------------------------------------------------------------ formatDate
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-CA')
}

// ----------------------------------------------------------------- getKycUsers
const getKycUsers = async () => {
  try {
    const data = await MC.model.User.aggregate(
      FindKycUsers()
    )
    return data.map(user => {
      return {
        ...user,
        submissionDate: formatDate(user.submissionDate)
      }
    }).sort(({ submissionDate: a }, { submissionDate: b }) => a < b ? 1 : a > b ? -1 : 0)
  } catch (e) {
    console.log('===================================== [Function: getKycUsers]')
    console.log(e)
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.get('/get-kyc-users', async (req, res) => {
  try {
    const format = req.query.format
    let users = await getKycUsers()
    if (users.length === 0) { return SendData(res, 403, 'Something went wrong. Try logging in again.') }
    if (format === 'csv') { users = Papa.unparse(users) }
    SendData(res, 200, 'KYC users retrieved succesfully', users)
  } catch (e) {
    console.log('================================== [Endpoint: /get-kyc-users]')
    console.log(e)
    SendData(res, 403, 'Something went wrong. Try logging in again.')
  }
})
