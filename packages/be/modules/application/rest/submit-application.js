console.log('💡 [endpoint] /submit-application')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Axios = require('axios')
const { SendData, GetFileFromDisk } = require('@Module_Utilities')
const SubmitHubspotContact = require('@Module_Application/logic/submit-hubspot-contact')

const MC = require('@Root/config')

const repos = {
  ga: ['filecoin-project/filecoin-plus-client-onboarding', 'data-preservation-programs/filecoin-plus-client-onboarding'],
  lda: ['filecoin-project/filecoin-plus-large-datasets', 'data-preservation-programs/filecoin-plus-large-datasets']
}

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////// processTemplate
const processTemplate = async (type, application) => {
  try {
    let template = await GetFileFromDisk(`${MC.staticRoot}/${type}-template.md`)
    template = template.toString()
    Object.keys(application).forEach((key) => {
      const regexp = /(?<=\s|^)@(?=[\w]+)/g
      let value = application[key] || 'n/a'
      if (value) {
        value = (`${value}` || '').replace(regexp, '[at]')
      }
      if (key === 'organization_website') {
        template = template.replaceAll(key, value)
      } else {
        template = template.replace(key, value)
      }
    })
    return template
  } catch (e) {
    console.log('================================= [Function: processTemplate]')
    console.log(e)
    throw e
  }
}

// /////////////////////////////////////////////////////////// submitApplication
const submitApplication = async (type, stage, template, application, repo, options) => {
  try {
    const orgName = application.organization_name
    const title = type === 'ga' ? `Client Allocation Request for: ${orgName}` : `[DataCap Application] ${orgName}`
    const body = { title, body: template }
    const response = await Axios.post(`https://api.github.com/repos/${repo}/issues`, body, options)
    return response.data
  } catch (e) {
    console.log('=============================== [Function: submitApplication]')
    throw e
  }
}

// //////////////////////////////////////////////////////////// addIssueMetadata
const addIssueMetadata = async (type, issueNumber, body, repo, options) => {
  try {
    if (MC.serverFlag !== 'production') {
      console.log(body)
    }
    const response = await Axios.post(`https://api.github.com/repos/${repo}/issues/${issueNumber}/${type}`, body, options)
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
    // ---------------------------------------- populate markdown issue template
    const template = await processTemplate(type, application)
    if (MC.serverFlag !== 'production') {
      console.log('===========================================================')
      console.log(`type → ${type} | stage → ${stage}`)
      console.log('labels →', labels)
      console.log('assignees →', assignees)
      console.log('comments →', comments)
      console.log(application)
      console.log(template)
    }
    // ------------------------------------------- submit/update Hubspot contact
    const hubspotOptIn = application.hubspot_opt_in
    if ((!user.hubspotOptIn && hubspotOptIn) || user.hubspotOptInContactId) {
      await SubmitHubspotContact(res, user, {
        email: application.hubspot_opt_in_email,
        firstname: application.hubspot_opt_in_first_name,
        lastname: application.hubspot_opt_in_last_name,
        company: application.organization_name,
        ...(application.ga_region && { fil__application_region: application.ga_region }), // fil__application_region: application.ga_region || application.data_owner_region,
        fil__application_datacap_requested: `${application.total_datacap_size} ${application.total_datacap_size_unit}`,
        filecoin_wallet_address: application.filecoin_address
      })
    }
    // ------------------------------------------------------ submit application
    const repo = MC.serverFlag === 'production' ? repos[type][0] : repos[type][1]
    const options = { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: `Bearer ${user.githubToken}` } }
    const githubIssue = await submitApplication(type, stage, template, application, repo, options)
    // -------- data-programs machine user -> submit assignees, labels, comments
    const issueNumber = githubIssue.number
    options.headers.Authorization = `Bearer ${process.env.GITHUB__PERSONAL_ACCESS_TOKEN__DATA_PROGRAMS}`
    if (labels.length > 0) {
      await addIssueMetadata('labels', issueNumber, { labels }, repo, options)
    }
    if (assignees.length > 0) {
      await addIssueMetadata('assignees', issueNumber, { assignees }, repo, options)
    }
    if (comments.length > 0) {
      const len = comments.length
      for (let i = 0; i < len; i++) {
        await addIssueMetadata('comments', issueNumber, { body: comments[i] }, repo, options)
      }
    }
    SendData(res, 200, 'Application submitted succesfully', githubIssue)
  } catch (e) {
    console.log('============================= [Endpoint: /submit-application]')
    if (e.code !== 422) {
      console.log(e)
    }
    SendData(res, e.code || 403, e.message || 'Something went wrong. Try again.')
  }
})
