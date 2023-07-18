/*

⏱️️ [Cron | every 5 minutes] KycGithubBot

- Get users in db
- For all users that have fully passed KYC (kyc.event === 'success | approve')
  - Fetch all of their currently open issues
    - If label does not exist, add label 'kyc verified'
    - If comment does not exist, add a comment with badge

*/

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const ModuleAlias = require('module-alias')
const Path = require('path')
const Axios = require('axios')
const Fs = require('fs-extra')
const Express = require('express')
const Chalk = require('chalk')
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
// /////////////////////////////////////////////////////////////////// getIssues
const getIssues = async (type, state, githubUsername, userToken, page = 1, issues = []) => {
  try {
    const repo = repos[type][MC.serverFlag === 'stable' ? 'stable' : 'production']
    const options = {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${userToken}` },
      params: {
        creator: githubUsername,
        per_page: 100,
        page,
        state
      }
    }
    const response = await Axios.get(`https://api.github.com/repos/${repo}/issues`, options)
    const data = response.data
    const len = data.length
    for (let i = 0; i < len; i++) {
      data[i].applicationType = type
    }
    issues = issues.concat(data)
    if (data.length === 100) {
      page += 1
      return getIssues(type, state, githubUsername, userToken, page, issues)
    }
    return issues
  } catch (e) {
    console.log('========================================== [Logic: getIssues]')
    throw e
  }
}

// //////////////////////////////////////////////////////////// getIssueComments
const getIssueComments = async (issue, userToken, page = 1, commentList = []) => {
  try {
    const options = {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${userToken}` },
      params: { per_page: 100, page }
    }
    issue.commentList = commentList
    const response = await Axios.get(issue.comments_url, options)
    const data = response.data
    commentList = commentList.concat(data)
    if (data.length === 100) {
      page += 1
      return getIssueComments(issue, userToken, page, commentList)
    }
    return commentList
  } catch (e) {
    console.log('=================================== [Logic: getIssueComments]')
    throw e
  }
}

// ///////////////////////////////////////////////////////////// addLabelToIssue
const addLabelToIssue = async (issue) => {
  try {
    const type = issue.applicationType
    const dataProgramsToken = process.env.GITHUB__PERSONAL_ACCESS_TOKEN__DATA_PROGRAMS
    const labelText = 'kyc verified'
    const found = issue.labels.find(label => label.name === labelText)
    if (!found) {
      const repo = repos[type][MC.serverFlag === 'stable' ? 'stable' : 'production']
      const body = { labels: [labelText] }
      const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${dataProgramsToken}` } }
      await Axios.post(`https://api.github.com/repos/${repo}/issues/${issue.number}/labels`, body, options)
      return true
    }
    return false
  } catch (e) {
    console.log('================================= [Function: addLabelToIssue]')
    throw e
  }
}

// /////////////////////////////////////////////////////////// addCommentToIssue
const addCommentToIssue = async (issue) => {
  try {
    const type = issue.applicationType
    const dataProgramsToken = process.env.GITHUB__PERSONAL_ACCESS_TOKEN__DATA_PROGRAMS
    const commentToAdd = 'This user’s identity has been verified through [filplus.storage](https://filplus.storage)'
    const badgeImgUrl = `${MC.baseUrls[MC.serverEnv === 'production' ? 'production' : 'stable']}/images/filplus-kyc-verified-badge.png`
    const body = {
      body: `<img width="32" alt="KYC" Verified src="${badgeImgUrl}"/>\n\n${commentToAdd}`
    }
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${dataProgramsToken}` } }
    const found = issue.commentList.find(comment => comment.body.includes(commentToAdd))
    if (!found) {
      const repo = repos[type][MC.serverFlag === 'stable' ? 'stable' : 'production']
      await Axios.post(`https://api.github.com/repos/${repo}/issues/${issue.number}/comments`, body, options)
      return true
    }
    return false
  } catch (e) {
    console.log('=============================== [Function: addCommentToIssue]')
    throw e
  }
}

// ////////////////////////////////////////////////////////////// deleteComments
// const deleteComments = async (commentList, type) => {
//   try {
//     const dataProgramsToken = process.env.GITHUB__PERSONAL_ACCESS_TOKEN__DATA_PROGRAMS
//     const len = commentList.length
//     for (let i = 0; i < len; i++) {
//       const comment = commentList[i]
//       const id = comment.id
//       const textToMatch = 'This user’s identity has has been verified through [filplus.storage](https://filplus.storage)'
//       const found = comment.body.includes(textToMatch)
//       if (found) {
//         const repo = repos[type][MC.serverFlag === 'stable' ? 'stable' : 'production']
//         const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${dataProgramsToken}` } }
//         const deleted = await Axios.delete(`https://api.github.com/repos/${repo}/issues/comments/${id}`, options)
//         console.log(id, comment.issue_url.split('/').pop(), deleted.status)
//       }
//     }
//   } catch (e) {
//     console.log('================================== [Function: deleteComments]')
//     throw e
//   }
// }

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
MC.app.on('mongoose-connected', async () => {
  console.log('🤖 KYC bot engaged', '\n')
  try {
    const issueState = 'all'
    const users = await MC.model.User.find({ 'kyc.event': { $in: ['success', 'approve'] } }).select('githubUsername githubToken').lean()
    const len = users.length
    for (let i = 0; i < len; i++) {
      const user = users[i]
      const githubUsername = user.githubUsername
      console.log(Chalk.bold.green(githubUsername))
      const userToken = Decrypt(user.githubToken)
      const lda = await getIssues('lda', issueState, githubUsername, userToken)
      const ga = await getIssues('ga', issueState, githubUsername, userToken)
      const issues = ga.concat(lda)
      const issueCount = issues.length
      console.log('○', `lda: ${lda.length.toLocaleString()} | ga: ${ga.length.toLocaleString()} | total: ${issueCount.toLocaleString()}`)
      for (let i = 0; i < issueCount; i++) {
        const issue = issues[i]
        const commentList = await getIssueComments(issue, userToken)
        issue.commentList = commentList
        // await deleteComments(issue.commentList, issue.applicationType)
        const labelNewlyAdded = await addLabelToIssue(issue)
        const commentNewlyAdded = await addCommentToIssue(issue)
        console.log(
          '  ',
          '↳',
          Chalk.bold(`#${issue.number}`),
          `(${issue.applicationType})`,
          `| ${commentList.length} comment${commentList.length === 1 ? '' : 's'}`,
          labelNewlyAdded && commentNewlyAdded ? `| ${Chalk.yellow.bold('label added')} | ${Chalk.blue.bold('comment added')}`
            : labelNewlyAdded ? `| ${Chalk.yellow.bold('label added')}`
              : commentNewlyAdded ? `| ${Chalk.blue.bold('comment added')}`
                : ''
        )
      }
    }
  } catch (e) {
    console.log('========================================= [💣: KycGithubBot]')
    console.log(e)
  }
  console.log('\n', '🏁 KYC bot shutting down')
  process.exit(0)
})
