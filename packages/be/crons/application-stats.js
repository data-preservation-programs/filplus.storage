/**
 *
 * ⏱️️ [Cron | every 1 hour] ApplicationStats
 *
 */

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const ModuleAlias = require('module-alias')
const Path = require('path')
const Fs = require('fs-extra')
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

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////////////// getTotalIssues

const getTotalIssues = async (repo, dataProgramsToken) => {
  try {
    const options = {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${dataProgramsToken}` },
      params: {
        type: 'issue'
      }
    }
    const response = await Axios.get(`https://api.github.com/search/issues?q=repo:${repo}`, options)
    return response.data.total_count
  } catch (e) {
    console.log('================================== [Function: getTotalIssues]')
    console.log(e)
    throw e
  }
}

// ///////////////////////////////////////////////////////////// getApplications

const getApplications = async (applicationType, n = 1, applications = []) => {
  try {
    const dataProgramsToken = process.env.GITHUB__PERSONAL_ACCESS_TOKEN__DATA_PROGRAMS
    const repo = MC.serverFlag === 'production' ? MC.repos[applicationType][0] : MC.repos[applicationType][1]
    const totalIssues = await getTotalIssues(repo, dataProgramsToken)
    const options = {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${dataProgramsToken}` },
      params: {
        state: 'all',
        per_page: 100,
        page: n
      }
    }
    const response = await Axios.get(`https://api.github.com/repos/${repo}/issues`, options)
    const updatedApplications = [...applications, ...response.data]
    if (updatedApplications.length !== totalIssues) {
      return getApplications(applicationType, n + 1, updatedApplications)
    } else {
      return updatedApplications
    }
  } catch (e) {
    console.log('================================= [Function: getApplications]')
    console.log(e)
    throw e
  }
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
const ApplicationStats = async () => {
  console.log('🤖 Fetch application stats started')
  try {
    const start = process.hrtime()[0]
    const gaApplications = await getApplications('ga')
    console.log('GA: ', gaApplications.length)
    const ldaApplications = await getApplications('lda')
    console.log('LDA: ', ldaApplications.length)

    // if (data) {
    //   Fs.writeFileSync(`${MC.cacheRoot}/application-stats.json`, JSON.stringify(data))
    // }
    const end = process.hrtime()[0]
    console.log(`🏁 Fetch network storage capacity complete | took ${SecondsToHms(end - start)}`)
    process.exit(0)
  } catch (e) {
    console.log('============================== [Cron: ApplicationStats]')
    console.log(e)
    process.exit(0)
  }
}; ApplicationStats()
