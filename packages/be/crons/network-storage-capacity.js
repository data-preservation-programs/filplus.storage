/**
 *
 * ⏱️️ [Cron | every 1 hour] NetworkStorageCapacity
 *
 */

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const ModuleAlias = require('module-alias')
const Path = require('path')
const Fs = require('fs-extra')
const Spawn = require('child_process').spawn
const Archiver = require('archiver')('zip')
const Moment = require('moment-timezone')
const Axios = require('axios')

require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

const MC = require('../config')

const BACKUP_PATH = Path.resolve(MC.serverRoot, 'backups')
const BACKUP_TMP_PATH = Path.resolve(MC.serverRoot, 'backups', 'tmp')

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
const NetworkStorageCapacity = async () => {
  console.log('🤖 Get network storage capacity started')
  try {
    const start = process.hrtime()[0]
    const token = process.env.SPACESCOPE_TOKEN
    const date = Moment.tz('UTC').subtract(1, 'days').format('YYYY-MM-DD')
    const options = { headers: { authorization: `Bearer ${token}` } }
    const response = await Axios.get(`https://api.spacescope.io/v2/power/network_storage_capacity?end_date=${date}&start_date=${date}`, options)
    const data = response.data.data
    if (data) {
      Fs.writeFileSync(`${MC.cacheRoot}/network-storage-capacity.json`, JSON.stringify(data))
    }
    const end = process.hrtime()[0]
    console.log(`🏁 General network storage capacity complete | took ${SecondsToHms(end - start)}`)
    process.exit(0)
  } catch (e) {
    console.log('============================== [Cron: NetworkStorageCapacity]')
    console.log(e)
    process.exit(0)
  }
}; NetworkStorageCapacity()
