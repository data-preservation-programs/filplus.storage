console.log('📦 [module] application')

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
MC.model.ApplicationChangedQueue = require('@Module_Application/model/application-changed-queue')
