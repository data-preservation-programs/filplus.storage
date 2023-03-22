// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { SendData } = require('@Module_Utilities')

const MC = require('@Root/config')

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (req, res, query) => {
  const identifier = req.session.identifier
  if (!identifier) { return SendData(res, 403, 'You are not logged in') }
  let user = await MC.model.User.findById(identifier.userId)
  const overrideUserId = query.user
  if (process.env.NODE_ENV !== 'production' && overrideUserId) {
    const overrideUser = await MC.model.User.find({ githubUsername: overrideUserId })
    if (overrideUser[0]) {
      user = overrideUser[0]
    }
  }
  if (!user) { return SendData(res, 500, 'Something went wrong, please try again') }
  return user
}
