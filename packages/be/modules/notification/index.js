console.log('📦 [module] notifications')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const { RunStartupChecks } = require('@Module_Utilities')

const MC = require('@Root/config')

// ////////////////////////////////////////////////////////////// Startup Checks
// -----------------------------------------------------------------------------
const checks = []
RunStartupChecks(checks)

// //////////////////////////////////////////////////////////////// Import Model
// -----------------------------------------------------------------------------
MC.model.Notification = require('@Module_Notification/model')
