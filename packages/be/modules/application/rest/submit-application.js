/* eslint-disable */
console.log('💡 [endpoint] /submit-application')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Axios = require('axios')
const { SendData, GetFileFromDisk, Delay } = require('@Module_Utilities')
const SubmitHubspotContact = require('@Module_Application/logic/submit-hubspot-contact')
const UUID = require('uuid')

const MC = require('@Root/config')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////// applyApplicationToSchema
const applyApplicationToSchema = async (schema, application) => {
  try {
    const applicationInfo = schema.applicationInfo
    Object.keys(applicationInfo).forEach((sectionKey) => {
      const section = applicationInfo[sectionKey]
      Object.keys(section).forEach((schemaValueKey) => {
        const schemaValue = section[schemaValueKey]
        const applicationValue = application[schemaValueKey]
        if (applicationValue === null) { return } // if value from form is null, don't populate schema
        if (typeof schemaValue === 'object' && !Array.isArray(schemaValue)) {
          Object.keys(schemaValue).forEach((schemaValueObjectKey) => {
            schema.applicationInfo[sectionKey][schemaValueKey][schemaValueObjectKey] = application[`${schemaValueKey}||${schemaValueObjectKey}`]
          })
        } else {
          schema.applicationInfo[sectionKey][schemaValueKey] = applicationValue
        }
      })
    })
    return schema
  } catch (e) {
    console.log('======================== [Function: applyApplicationToSchema]')
    console.log(e)
    throw e
  }
}

// ///////////////////////////////////////////////// checkIfUserOptedInToHubspot
const checkIfUserOptedInToHubspot = (application) => {
  const firstName = application.hubspot_opt_in_first_name
  const lastName = application.hubspot_opt_in_last_name
  const email = application.hubspot_opt_in_email
  if (!firstName || !lastName || !email) { return false }
  if (firstName === '' || lastName === '' || email === '') { return false }
  return true
}

// //////////////////////////////////////////////////////////////////// getForks
const getForks = async (githubUsername, token, page = 1, forks = []) => {
  try {
    const repo = 'data-preservation-programs/filecoin-plus-large-datasets'
    const options = {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` },
      params: { per_page: 100, page }
    }
    const response = await Axios.get(`https://api.github.com/repos/${repo}/forks`, options)
    const data = response.data
    forks = forks.concat(data)
    if (data.length === 100) {
      page += 1
      return await getForks(githubUsername, token, page, forks)
    }
    return forks
  } catch (e) {
    console.log('=========================================== [Logic: getForks]')
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// forkRepo
const forkRepo = async (token) => {
  try {
    const repo = 'data-preservation-programs/filecoin-plus-large-datasets'
    const body = { default_branch_only: true }
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.post(`https://api.github.com/repos/${repo}/forks`, body, options)
    return response.data
  } catch (e) {
    console.log('======================================== [Function: forkRepo]')
    throw e
  }
}

// //////////////////////////////////////////////////////////// getMainBranchSha
const getMainBranchSha = async (forkedRepoName, loopCount, token) => {
  try {
    if (loopCount >= 20) {
      throw new Error('Tried too many times to get `main` branch. Try again later.')
    }
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.get(`https://api.github.com/repos/${forkedRepoName}/branches`, options)
    const branches = response.data
    const mainBranch = branches.find(branch => branch.name === 'main')
    if (!mainBranch) {
      loopCount++
      await Delay(50)
      return await getMainBranchSha(forkedRepoName, loopCount, token)
    }
    return mainBranch.commit.sha
  } catch (e) {
    console.log('================================ [Function: getMainBranchSha]')
    throw e
  }
}

// ///////////////////////////////////////////////////////////// createReference
const createReference = async (forkedRepoName, mainBranchSha, token) => {
  try {
    const branchId = UUID.v4()
    const body = {
      ref: `refs/heads/${branchId}`,
      sha: mainBranchSha
    }
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.post(`https://api.github.com/repos/${forkedRepoName}/git/refs`, body, options)
    return {
      branchId,
      branch: response.data
    }
  } catch (e) {
    console.log('================================= [Function: createReference]')
    throw e
  }
}

// ////////////////////////////////////////////////////////////////// createBlob
const createBlob = async (forkedRepoName, application, token) => {
  try {
    const body = {
      content: application
    }
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.post(`https://api.github.com/repos/${forkedRepoName}/git/blobs`, body, options)
    return response.data
  } catch (e) {
    console.log('====================================== [Function: createBlob]')
    throw e
  }
}

// ////////////////////////////////////////////////////// getReferenceBranchTree
const getReferenceBranchTree = async (forkedRepoName, branchId, token) => {
  try {
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.get(`https://api.github.com/repos/${forkedRepoName}/git/trees/${branchId}`, options)
    return response.data
  } catch (e) {
    console.log('========================== [Function: getReferenceBranchTree]')
    throw e
  }
}

// /////////////////////////////////////////////////////////////// createGitTree
const createGitTree = async (forkedRepoName, blob, referenceTree, token) => {
  try {
    const body = {
      tree: [{
        path: `applications/${UUID.v4()}.json`,
        mode: '100644',
        type: 'blob',
        sha: blob.sha
      }],
      base_tree: referenceTree.sha
    }
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.post(`https://api.github.com/repos/${forkedRepoName}/git/trees`, body, options)
    return response.data
  } catch (e) {
    console.log('=================================== [Function: createGitTree]')
    throw e
  }
}

// //////////////////////////////////////////////////////////////// createCommit
const createCommit = async (forkedRepoName, tree, branch, token) => {
  try {
    const body = {
      message: 'This is a commit message',
      tree: tree.sha,
      parents: [branch.object.sha]
    }
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.post(`https://api.github.com/repos/${forkedRepoName}/git/commits`, body, options)
    return response.data
  } catch (e) {
    console.log('==================================== [Function: createCommit]')
    throw e
  }
}

// /////////////////////////////////////////////////////////// addCommitToBranch
const addCommitToBranch = async (forkedRepoName, branch, commit, token) => {
  try {
    const body = {
      sha: commit.sha,
      force: true
    }
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.patch(`https://api.github.com/repos/${forkedRepoName}/git/${branch.ref}`, body, options)
    return response.data
  } catch (e) {
    console.log('=============================== [Function: addCommitToBranch]')
    throw e
  }
}

// /////////////////////////////////////////////////////// mergeCommitIntoBranch
const mergeCommitIntoBranch = async (forkedRepoName, branchId, commit, token) => {
  try {
    const body = {
      base: branchId,
      head: commit.sha
    }
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.post(`https://api.github.com/repos/${forkedRepoName}/merges`, body, options)
    return response.data
  } catch (e) {
    console.log('=========================== [Function: mergeCommitIntoBranch]')
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// createPR
const createPR = async (forkedRepoName, branchId, githubUsername, token) => {
  try {
    const body = {
      title: `Brand new LDN application`,
      head: `${githubUsername}:${branchId}`,
      body: '🦄',
      base: 'main',
      maintainer_can_modify: true
    }
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${token}` } }
    const response = await Axios.post(`https://api.github.com/repos/data-preservation-programs/filecoin-plus-large-datasets/pulls`, body, options)
    return response.data
  } catch (e) {
    console.log('======================================== [Function: createPR]')
    throw e
  }
}

// /////////////////////////////////////////////////////////// submitApplication
// const submitApplication = async (type, stage, template, application, repo, options) => {
//   try {
//     const orgName = application.organization_name
//     const title = type === 'ga' ? `Client Allocation Request for: ${orgName}` : `[DataCap Application] ${orgName}`
//     const body = { title, body: template }
//     const response = await Axios.post(`https://api.github.com/repos/${repo}/issues`, body, options)
//     return response.data
//   } catch (e) {
//     console.log('=============================== [Function: submitApplication]')
//     throw e
//   }
// }

// //////////////////////////////////////////////////////////// addIssueMetadata
const addIssueMetadata = async (type, prNumber, body, repo) => {
  try {
    if (MC.serverFlag !== 'production') {
      console.log(body)
    }
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${process.env.GITHUB__PERSONAL_ACCESS_TOKEN__DATA_PROGRAMS}` } }
    const response = await Axios.post(`https://api.github.com/repos/${repo}/issues/${prNumber}/${type}`, body, options)
    return response.data
  } catch (e) {
    console.log('================================ [Function: addIssueMetadata]')
    throw e
  }
}

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.app.post('/submit-application', async (req, res) => {
  const body = req.body
  const application = body.application
  const labels = body.labels
  const assignees = body.assignees
  const comments = body.comments
  const stage = req.query.stage
  try {
    if (!stage || stage === '') { return SendData(res, 403, 'Something went wrong. Try again.') }
    const type = stage === 'stage-ga' ? 'ga' : 'lda'
    const identifier = req.session.identifier
    if (!identifier) { return SendData(res, 403, 'You are not logged in') }
    const user = await MC.model.User.findById(identifier.userId)
    const githubUsername = user.githubUsername
    const githubToken = user.githubToken
    // ---------------------------------------- populate markdown issue template
    let schema = await GetFileFromDisk(`${MC.cacheRoot}/application-schema.json`, true)
    schema = await applyApplicationToSchema(schema, application)
    // ------------------------------------------- submit/update Hubspot contact
    const userOptedIn = checkIfUserOptedInToHubspot(application)
    if ((!user.hubspotOptIn && userOptedIn) || user.hubspotOptInContactId) {
      await SubmitHubspotContact(res, user, {
        email: application.hubspot_opt_in_email,
        firstname: application.hubspot_opt_in_first_name,
        lastname: application.hubspot_opt_in_last_name,
        company: application.organization_name,
        fil__application_region: application.ga_region || application.data_owner_region,
        fil__application_datacap_requested: `${application.total_datacap_size} ${application.total_datacap_size_unit}`,
        filecoin_wallet_address: application.filecoin_address
      })
    }
    // -------------------------------------------------------- Create fork & PR
    /**
     * First, grab all the forks and check to see if the target fork already exists
     */
    console.log('💡 get forks')
    const forks = await getForks(githubUsername, githubToken, [])
    let fork = forks.find(fork => fork.name === 'filecoin-plus-large-datasets')
    /**
     * If the fork does NOT exist, create it.
     */
    if (!fork) {
      fork = await forkRepo(user.githubToken)
    }
    const forkedRepoName = fork.full_name
    console.log(fork)
    /**
     * Grab the sha hash of the `main` branch of the forked repo. Github creates
     * forks asynchronously. The below runs a recursive API call loop and only
     * continues when a `main` branch sha reference is detected
     */
    console.log('⚡️ [sha ref of main branch] get sha hash of MAIN branch of the forked repo')
    const mainBranchSha = await getMainBranchSha(forkedRepoName, 0, githubToken)
    console.log(mainBranchSha)
    /**
     * Branch off the `main` branch of the forked repo
     */
    console.log('⚡️ [branch] branch off MAIN branch')
    const reference = await createReference(forkedRepoName, mainBranchSha, githubToken)
    console.log(reference.branch)
    /**
     * Create a blob of the JSON containing the incoming application
     */
    console.log('⚡️ [blob] create a BLOB of the application')
    const blob = await createBlob(forkedRepoName, JSON.stringify(schema, null, 2), githubToken)
    console.log(blob)
    /**
     * Create a git tree that contains the blob
     */
    console.log('⚡️ [tree] get the TREE of the `reference` branch')
    const referenceTree = await getReferenceBranchTree(forkedRepoName, reference.branchId, githubToken)
    console.log(referenceTree)
    console.log('⚡️ [tree] create a git TREE containing the blob')
    const tree = await createGitTree(forkedRepoName, blob, referenceTree, githubToken)
    console.log(tree)
    /**
     * Create a commit using the tree
     */
    console.log('⚡️ [commit] create a COMMIT inside the tree containing the blob')
    const commit = await createCommit(forkedRepoName, tree, reference.branch, githubToken)
    console.log(commit)
    /**
     * Add the commit to the branch
     */
    console.log('⚡️ [commit → branch] add commit to `reference` branch')
    await addCommitToBranch(forkedRepoName, reference.branch, commit, githubToken)
    /**
     *
     */
    // console.log('⚡️ [commit → main] merge branch into main')
    // await mergeCommitIntoBranch(forkedRepoName, reference.branchId, commit, githubToken)
    /**
     * Open a PR for the new branch
     */
    console.log('⚡️ [PR] open a PR for the new branch')
    const pr = await createPR(forkedRepoName, reference.branchId, githubUsername, githubToken)
    console.log(pr)
    // ----------------------------------------------------------------- logging
    if (MC.serverFlag !== 'production') {
      console.log('===========================================================')
      console.log(`type → ${type} | stage → ${stage}`)
      console.log('labels →', labels)
      console.log('assignees →', assignees)
      console.log('comments →', comments)
      console.log(application)
      console.log(schema)
    }
    // ------------------------------------------------------ submit application
    const repo = MC.repos[type][MC.serverFlag]
    // // -------- data-programs machine user -> submit assignees, labels, comments
    const prNumber = pr.number
    if (labels.length > 0) {
      await addIssueMetadata('labels', prNumber, { labels }, repo)
    }
    if (assignees.length > 0) {
      await addIssueMetadata('assignees', prNumber, { assignees }, repo)
    }
    if (comments.length > 0) {
      const len = comments.length
      for (let i = 0; i < len; i++) {
        await addIssueMetadata('comments', prNumber, { body: comments[i] }, repo)
      }
    }
    SendData(res, 200, 'Application submitted succesfully', pr)
  } catch (e) {
    console.log('============================= [Endpoint: /submit-application]')
    if (e.code !== 422) {
      console.log(e)
    }
    SendData(res, e.code || 403, e.message || 'Something went wrong. Try again.')
  }
})
