console.log('📦 [module] history')

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
MC.model.History = require('@Module_History/model')