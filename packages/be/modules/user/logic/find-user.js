// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const MC = require('@Root/config')

// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
module.exports = async (query = {}, projections = {}) => {
  return await MC.model.User.findOne(query, projections)
}
