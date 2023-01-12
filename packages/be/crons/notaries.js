/**
 *
 * ⏱️️ [Cron | every 1 hour] Notaries
 *
 */

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const ModuleAlias = require('module-alias')
const Path = require('path')
const Fs = require('fs-extra')
const Moment = require('moment-timezone')
const Axios = require('axios')

require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

const MC = require('../config')

// ///////////////////////////////////////////////////////////////////// Aliases
ModuleAlias.addAliases({
  '@Root': MC.packageRoot,
  '@Static': `${MC.packageRoot}/static`,
  '@Public': `${MC.packageRoot}/public`,
  '@Cache': `${MC.packageRoot}/cache`,
  '@Modules': `${MC.packageRoot}/modules`
})

try {
  const modulesRoot = `${MC.packageRoot}/modules`
  const items = Fs.readdirSync(modulesRoot)
  items.forEach((name) => {
    const path = `${modulesRoot}/${name}`
    if (Fs.statSync(path).isDirectory()) {
      const moduleName = (name[0].toUpperCase() + name.substring(1)).replace(/-./g, x => x[1].toUpperCase())
      ModuleAlias.addAlias(`@Module_${moduleName}`, path)
    }
  })
} catch (e) {
  console.log(e)
}

// ///////////////////////////////////////////////////////////////////// Modules
const { SecondsToHms } = require('@Module_Utilities')

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
const Notaries = async () => {
  console.log('🤖 Fetch notaries list started')
  try {
    const start = process.hrtime()[0]
    const response = await Axios.get('https://raw.githubusercontent.com/keyko-io/filecoin-content/main/json/prod/verifiers-registry.json')
    const data = response.data
    if (data && data.notaries) {
      Fs.writeFileSync(`${MC.cacheRoot}/notaries-list.json`, JSON.stringify(data.notaries))
    }
    const end = process.hrtime()[0]
    console.log(`🏁 Fetch notaries list complete | took ${SecondsToHms(end - start)}`)
    process.exit(0)
  } catch (e) {
    console.log('============================================ [Cron: Notaries]')
    console.log(e)
    process.exit(0)
  }
}; Notaries()
