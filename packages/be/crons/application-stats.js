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
  console.log('🦞 > 🦀 getting total issues')
  try {
    const options = {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${dataProgramsToken}` }
    }
    const response = await Axios.get(`https://api.github.com/search/issues?q=repo:${repo}%20is:issue`, options)
    return response.data.total_count
  } catch (e) {
    console.log('================================== [Function: getTotalIssues]')
    console.log(e)
    throw e
  }
}

// ///////////////////////////////////////////////////////////// getApplications

const getApplications = async (applicationType, n = 1, applications = [], totalIssues = 0) => {
  console.log(`🦞 getting applications: request ${n}`)
  try {
    const dataProgramsToken = process.env.GITHUB__PERSONAL_ACCESS_TOKEN__DATA_PROGRAMS
    const repo = MC.repos[applicationType][0]
    if (totalIssues === 0) { totalIssues = await getTotalIssues(repo, dataProgramsToken); console.log('totalIssues ', totalIssues) }

    const options = {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${dataProgramsToken}` },
      params: {
        state: 'all',
        per_page: 100,
        page: n
      }
    }
    const response = await Axios.get(`https://api.github.com/repos/${repo}/issues?q=is:issue`, options)
    const updatedApplications = [...applications, ...response.data]
    if (updatedApplications.length < totalIssues) {
      console.log('updatedApplications.length totalIssues ', updatedApplications.length, totalIssues)
      return getApplications(applicationType, n + 1, updatedApplications, totalIssues)
    }
    return updatedApplications
  } catch (e) {
    console.log('================================= [Function: getApplications]')
    console.log(e)
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// hasLabel
const hasLabel = (labels, regex) => {
  return labels.some((label) => { return label.name.match(regex) })
}

// //////////////////////////////////////////// determineApplicationStateByLabel
const determineApplicationStateByLabel = (application, applicationType) => {
  console.log('🦊 > 🐡 determining application state')
  try {
    const labels = application.labels
    const completedRegex = { ga: /(state:)?\s?granted/gi, lda: /total\s?datacap\s?reached/gi }
    const validatedRegex = { ga: /(bot:)?\s?looking\s?good/gi, lda: /validated/ }
    const inReviewRegex = { ga: /(state)|(bot)?:\s?(further\s?info)?(review)?\s?needed/gi, lda: /error/ }

    const completed = hasLabel(labels, completedRegex[applicationType])
    const validated = hasLabel(labels, validatedRegex[applicationType])
    const inReview = hasLabel(labels, inReviewRegex[applicationType])
    const Stale = hasLabel(labels, /Stale/)
    const isPR = application.pull_request

    if (isPR) { return 'isPR' }
    if (completed) { return 'completed' }
    if (validated) { return 'validated' }
    if (inReview) { return 'inReview' }
    if (Stale) { return 'Stale' }
    return false
  } catch (e) {
    console.log('================ [Function: determineApplicationStateByLabel]')
    console.log(e)
    throw e
  }
}

// ///////////////////////////////////////////////////////// iterateApplications
const iterateApplications = (applications, applicationType) => {
  console.log('🦊 iterating over Applications')
  try {
    const states = {
      completed: 0,
      validated: 0,
      inReview: 0,
      Stale: 0,
      isPR: 0,
      noRelevantLabels: []
    }
    applications.forEach((application) => {
      const applicationState = determineApplicationStateByLabel(application, applicationType)
      if (!applicationState) {
        states.noRelevantLabels.push(application.number)
      } else {
        states[applicationState]++
      }
    })
    const stats = { states }
    return stats
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

    console.log('gaStats ', gaStats)
    console.log('gaStats.states.noRelevantLabels.length ', gaStats.states.noRelevantLabels.length)
    console.log('ldaStats ', ldaStats)
    console.log('ldaStats.states.noRelevantLabels.length ', ldaStats.states.noRelevantLabels.length)

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
