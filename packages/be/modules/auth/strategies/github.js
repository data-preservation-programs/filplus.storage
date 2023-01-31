// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Axios = require('axios')
const FindUser = require('@Module_User/logic/find-user')
const CreateUser = require('@Module_User/logic/create-user')
const UpdateUser = require('@Module_User/logic/update-user')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////////////// getAccessToken
const getAccessToken = async (req, tempToken) => {
  const body = {
    client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
    client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    code: tempToken
  }
  const options = { headers: { Accept: 'application/json' } }
  try {
    const response = await Axios.post('https://github.com/login/oauth/access_token', body, options)
    const data = response.data
    if (!data.hasOwnProperty('error')) { return data.access_token }
    if (req.session.identifier) { req.session.destroy() }
    throw new Error(data.error_description || 'Generate a new token by logging in again')
  } catch (e) {
    console.log('================================== [Function: getAccessToken]')
    throw e
  }
}

// //////////////////////////////////////////////////// getUserProfileFromGithub
const getUserProfileFromGithub = async (token) => {
  const options = { headers: { Accept: 'application/json', Authorization: `token ${token}` } }
  try {
    const response = await Axios.get('https://api.github.com/user', options)
    const data = response.data
    return {
      githubUsername: data.login,
      githubAvatarUrl: data.avatar_url,
      githubHtmlUrl: data.html_url,
      githubToken: token,
      email: data.email
    }
  } catch (e) {
    console.log('======================== [Function: getUserProfileFromGithub]')
    throw e
  }
}

// /////////////////////////////////////////////////////////////////// getEmails
const getEmails = async (token) => {
  const options = { headers: { Accept: 'application/json', Authorization: `token ${token}` } }
  try {
    const response = await Axios.get('https://api.github.com/user/emails', options)
    const found = response.data.find(obj => obj.verified && obj.visibility === 'public')
    if (found) { return found.email }
    return false
  } catch (e) {
    console.log('======================================= [Function: getEmails]')
    throw e
  }
}

// /////////////////////////////////////////////////////////////// createNewUser
const createNewUser = async (githubProfile, token) => {
  try {
    const created = await CreateUser(githubProfile)
    if (!created) { throw new Error('Something went wrong') }
    return created
  } catch (e) {
    console.log('=================================== [Function: createNewUser]')
    throw e
  }
}

// ////////////////////////////////////////////////////////// updateExistingUser
const updateExistingUser = async (githubProfile) => {
  try {
    const updated = await UpdateUser(githubProfile)
    if (!updated) { throw new Error('Something went wrong') }
    return updated
  } catch (e) {
    console.log('============================== [Function: updateExistingUser]')
    throw e
  }
}

// /////////////////////////////////////////////////////////////// createSession
const createSession = (req, userId) => {
  return new Promise((resolve) => {
    req.session.identifier = userId
    resolve()
  })
}

// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
module.exports = async (req, tempToken) => {
  try {
    const token = await getAccessToken(req, tempToken)
    // Get user profile & emails from Github
    const githubProfile = await getUserProfileFromGithub(token)
    if (typeof githubProfile.email === 'object') {
      const email = await getEmails(token)
      if (email) { githubProfile.email = email }
    }
    // Find existing user
    let user = await FindUser({ $or: [{ githubUsername: githubProfile.githubUsername }, { email: githubProfile.email }] })
    // If no user exists in db, create new user, else update user (with githubToken)
    if (!user) {
      user = await createNewUser(githubProfile, token)
    } else {
      githubProfile._id = user._id
      user = await updateExistingUser(githubProfile)
    }
    // Create session
    const identifier = { userId: `${user._id}` }
    await createSession(req, identifier)
    return identifier
  } catch (e) {
    console.log('============================ [Function: TradeTokenAndGetUser]')
    throw e
  }
}