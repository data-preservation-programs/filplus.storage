/**
 *
 * ⏱️️ [Cron | every 15 minutes] ApplicationStats
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
const DetermineApplicationState = require('@Module_Application/logic/determine-application-state')
const HasLabel = require('@Module_Application/logic/has-label')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////// getApplications
const getApplications = async (applicationType, n = 1, applications = []) => {
  console.log(`🦞 getting ${applicationType} applications: request ${n}`)
  try {
    const dataProgramsToken = process.env.GITHUB__PERSONAL_ACCESS_TOKEN__DATA_PROGRAMS
    const repo = MC.repos[applicationType].production
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
    if (response.data.length === 100) {
      return getApplications(applicationType, n + 1, updatedApplications)
    }
    return updatedApplications
  } catch (e) {
    console.log('================================= [Function: getApplications]')
    console.log(e)
    throw e
  }
}

// //////////////////////////////////////////// iterateApplicationLabels
const iterateApplicationLabels = (application, applicationType) => {
  try {
    const labels = application.labels.map(label => (label.name.toLowerCase())).sort()

    const applicationState = DetermineApplicationState(labels, applicationType)

    const filPlusStorageRegex = /(source:)?\s?filplus\.?storage/ig
    const filPlusStorage = HasLabel(labels, filPlusStorageRegex)

    if (applicationType === 'lda') {
      const eFilPlusRegex = /e[-\s]?fil\s?(plus)?\+?/ig
      const eFilPlus = HasLabel(labels, eFilPlusRegex)
      return { applicationState, filPlusStorage, eFilPlus }
    }
    const eFilPlus = false
    return { applicationState, filPlusStorage, eFilPlus }
  } catch (e) {
    console.log('======================== [Function: iterateApplicationLabels]')
    console.log(e)
    throw e
  }
}

// ///////////////////////////////////////////////////////// iterateApplications
const iterateApplications = (applications, applicationType) => {
  console.log(`🦊 iterating over ${applicationType} applications`)
  try {
    const states = {
      reviewing: 0,
      validated: 0,
      completed: 0
    }
    const types = {
      lda: {
        open: 0,
        closed: 0
      },
      ga: {
        open: 0,
        closed: 0
      },
      eFilPlus: {
        open: 0,
        closed: 0
      },
      filPlusStorage: {
        open: 0,
        closed: 0
      }
    }
    applications.forEach((application) => {
      const { applicationState, filPlusStorage, eFilPlus } = iterateApplicationLabels(application, applicationType)
      if (applicationState) {
        const issueState = application.state
        types[applicationType][issueState]++
        if (filPlusStorage) { types.filPlusStorage[issueState]++ }
        if (eFilPlus) { types.eFilPlus[issueState]++ }
        if (applicationState !== 'noRelevantLabels') { states[applicationState]++ }
      }
    })
    return { states, types }
  } catch (e) {
    console.log('============================= [Function: iterateApplications]')
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
    const ldaApplications = await getApplications('lda')

    const gaStats = await iterateApplications(gaApplications, 'ga')
    const ldaStats = await iterateApplications(ldaApplications, 'lda')

    const data = {
      states: {
        reviewing: gaStats.states.reviewing + ldaStats.states.reviewing,
        validated: gaStats.states.validated + ldaStats.states.validated,
        completed: gaStats.states.completed + ldaStats.states.completed,
        segmented: {
          lda: ldaStats.states,
          ga: gaStats.states
        }
      },
      types: {
        lda: ldaStats.types.lda,
        ga: gaStats.types.ga,
        eFilPlus: ldaStats.types.eFilPlus,
        filPlusStorage: {
          open: gaStats.types.filPlusStorage.open + ldaStats.types.filPlusStorage.open,
          closed: gaStats.types.filPlusStorage.closed + ldaStats.types.filPlusStorage.closed
        }
      }
    }

    if (data) {
      Fs.writeFileSync(`${MC.cacheRoot}/application-stats.json`, JSON.stringify(data))
    }

    const end = process.hrtime()[0]
    console.log(`🏁 Fetch network storage capacity complete | took ${SecondsToHms(end - start)}`)
    process.exit(0)
  } catch (e) {
    console.log('==================================== [Cron: ApplicationStats]')
    console.log(e)
    process.exit(0)
  }
}; ApplicationStats()
