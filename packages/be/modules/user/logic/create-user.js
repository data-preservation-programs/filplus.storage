// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const CreateUser = async (incoming) => {
  try {
    console.log(MC.model)
    const created = await MC.model.User.create(incoming)
    if (!created) { return false }
    const userId = created._id
    await MC.model.History.create({
      bucket: 'user',
      event: 'create',
      initiator: userId,
      client: userId,
      subject: userId,
      initiator_ref: 'fp_users',
      client_ref: 'fp_users',
      subject_ref: 'fp_users',
      before: null,
      after: created
    })
    return created
  } catch (e) {
    console.log('========================================= [Logic: CreateUser]')
    throw e
  }
}

// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
module.exports = CreateUser
