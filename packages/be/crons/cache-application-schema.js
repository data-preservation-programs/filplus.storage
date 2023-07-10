/**
 *
 * ⏱️️ [Cron | every 1 minute] CacheApplicationSchema
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
const CacheApplicationSchema = async () => {
  console.log('🤖 Fetch application schema started')
  try {
    const start = process.hrtime()[0]
    const date = Moment.tz('UTC').subtract(1, 'days').format('YYYY-MM-DD')
    const response = await Axios.get('https://raw.githubusercontent.com/data-preservation-programs/filecoin-plus-large-datasets/main/schema/application-v1.json')
    const data = response.data
    if (data) {
      Fs.writeFileSync(`${MC.cacheRoot}/application-schema.json`, JSON.stringify(data, false, 2))
    }
    const end = process.hrtime()[0]
    console.log(`🏁 Fetch application schema complete | took ${SecondsToHms(end - start)}`)
    process.exit(0)
  } catch (e) {
    console.log('============================== [Cron: CacheApplicationSchema]')
    console.log(e)
    process.exit(0)
  }
}; CacheApplicationSchema()
