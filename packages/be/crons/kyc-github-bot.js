/**
 *
 * ⏱️️ [Cron | every 1 minute] KycGithubBot
 *
 */

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const ModuleAlias = require('module-alias')
const Path = require('path')
const Axios = require('axios')
const Fs = require('fs-extra')
const Express = require('express')
require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

const MC = require('../config')

const repos = MC.repos

// ////////////////////////////////////////////////////////////////// Initialize
MC.app = Express()

// ///////////////////////////////////////////////////////////////////// Aliases
ModuleAlias.addAliases({
  '@Root': MC.packageRoot,
  '@Modules': `${MC.packageRoot}/modules`,
  '@Logic': `${MC.packageRoot}/logic`
})

try {
  const modulesRoot = `${MC.packageRoot}/modules`
  const items = Fs.readdirSync(modulesRoot)
  items.forEach((name) => {
    const path = `${modulesRoot}/${name}`
    if (Fs.statSync(path).isDirectory()) {
      const moduleName = `${name[0].toUpperCase() + name.substring(1)}`
      ModuleAlias.addAlias(`@Module_${moduleName}`, path)
    }
  })
} catch (e) {
  console.log(e)
}

// ///////////////////////////////////////////////////////////////////// Modules
require('@Module_Database')
require('@Module_User')
const { Decrypt } = require('@Logic/cipher')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////// getCurrentlyOpenIssues
const getCurrentlyOpenIssues = async (user, type, token) => {
  try {
    user[type] = []
    const repo = MC.serverFlag === 'production' ? repos[type][0] : repos[type][1]
    const options = {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` },
      params: {
        creator: user.githubUsername,
        per_page: 100
      }
    }
    const response = await Axios.get(`https://api.github.com/repos/${repo}/issues`, options)
    user[type] = response.data
  } catch (e) {
    console.log('============================= [Logic: getCurrentlyOpenIssues]')
    console.log(e)
    throw e
  }
}

// //////////////////////////////////////////////////////////// addLabelToIssues
const addLabelToIssues = async (issues, type) => {
  let countUpdated = 0
  try {
    const token = process.env.GITHUB__PERSONAL_ACCESS_TOKEN__DATA_PROGRAMS
    const label = 'kyc verified'
    const len = issues.length
    for (let i = 0; i < len; i++) {
      const issue = issues[i]
      const found = issue.labels.find(label => label.name === 'kyc verified')
      if (!found) {
        const repo = MC.serverFlag === 'production' ? repos[type][0] : repos[type][1]
        const body = { labels: [label] }
        const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
        const response = await Axios.post(`https://api.github.com/repos/${repo}/issues/${issue.number}/labels`, body, options)
        countUpdated++
      }
    }
    console.log(`  → label added to ${countUpdated} ${type.toUpperCase()}${countUpdated === 1 ? '' : 's'}`)
  } catch (e) {
    console.log('================================ [Function: addLabelToIssues]')
    throw e
  }
}

// ////////////////////////////////////////////////////////// addCommentToIssues
const addCommentToIssues = async (issues, type, userToken) => {
  let countUpdated = 0
  try {
    const dataProgramsToken = process.env.GITHUB__PERSONAL_ACCESS_TOKEN__DATA_PROGRAMS
    const commentToAdd = 'This user’s identity has has been verified through [filplus.storage](https://filplus.storage)'
    const badgeImgUrl = `${MC.baseUrls[MC.serverEnv === 'production' ? 'production' : 'stable']}/images/filplus-kyc-verified-badge.png`
    const len = issues.length
    for (let i = 0; i < len; i++) {
      const issue = issues[i]
      const repo = MC.serverFlag === 'production' ? repos[type][0] : repos[type][1]
      const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${userToken}` } }
      const comments = await Axios.get(issue.comments_url, options)
      const found = comments.data.find(comment => comment.body.includes(commentToAdd))
      if (!found) {
        const body = {
          body: `<img width="32" alt="KYC" Verified src="${badgeImgUrl}"/>\n\n${commentToAdd}`
        }
        await Axios.post(`https://api.github.com/repos/${repo}/issues/${issue.number}/comments`, body, options)
        countUpdated++
      }
    }
    console.log(`  → comment added to ${countUpdated} ${type.toUpperCase()}${countUpdated === 1 ? '' : 's'}`)
  } catch (e) {
    console.log('============================== [Function: addCommentToIssues]')
    throw e
  }
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
/*
- Get users
- For all users that have fully passed KYC ->
- Fetch all of their currently open issues
  - Add a comment with badge (☑️ This user’s identity has has been verified through filplus.storage)
  - Add label 'kyc verified'
*/
MC.app.on('mongoose-connected', async () => {
  console.log('🤖 KYC bot engaged')
  try {
    const users = await MC.model.User.find({ 'kyc.event': 'kyc-success' }).select('githubUsername githubToken').lean()
    const len = users.length
    for (let i = 0; i < len; i++) {
      const user = users[i]
      const userToken = Decrypt(user.githubToken)
      await getCurrentlyOpenIssues(user, 'ga', userToken)
      await getCurrentlyOpenIssues(user, 'lda', userToken)
      console.log(`${user.githubUsername} | ga: ${user.ga.length} | lda: ${user.lda.length}`)
      await addLabelToIssues(user.lda, 'lda')
      await addLabelToIssues(user.ga, 'ga')
      await addCommentToIssues(user.lda, 'lda', userToken)
      await addCommentToIssues(user.ga, 'ga', userToken)
    }
    // console.log(users[0].ga[0])
  } catch (e) {
    console.log('========================================== [🚀: KycGithubBot]')
    console.log(e)
  }
  console.log('🏁 KYC bot shutting down')
  process.exit(0)
})
