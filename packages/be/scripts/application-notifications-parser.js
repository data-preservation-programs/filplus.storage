/*

⏱️️ [Script | infinite] ApplicationNotificationParser

*/

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const ModuleAlias = require('module-alias')
const Path = require('path')
const Fs = require('fs-extra')
const Express = require('express')
require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

const MC = require('../config')

/**
 * This script runs depends on a websocket connection. Since this script runs
 * indefinitely, whereas a websocket connection is re-established whenever the
 * backend restarts, we don't want the script to restart as well. The timeout
 * needs to be cleared whenever the websocket connection is re-established.
 */

let TIMEOUT

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
require('@Module_Utilities')
require('@Module_User')
require('@Module_Application')
require('@Module_Notification')

const { GenerateWebsocketClient } = require('@Module_Utilities')
const FindUser = require('@Module_User/logic/find-user')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////// getUniqueQueueEntries
const getUniqueQueueEntries = async (queue) => {
  try {
    const compiled = {}
    const deleteFromQueueOperations = []
    const len = queue.length
    for (let i = 0; i < len; i++) {
      const entry = queue[i]
      const githubUsername = entry.githubUsername
      entry.labels = JSON.stringify(entry.labels)
      // All entries processed in this run of ApplicationNotificationParser should be deleted at the end
      deleteFromQueueOperations.push({
        deleteOne: {
          filter: { _id: `${entry._id}` }
        }
      })
      delete entry._id
      // Add a user entry and the first queue item if none exists yet
      if (!compiled.hasOwnProperty(githubUsername)) {
        compiled[githubUsername] = [entry]
      // Otherwise, only collect unique entries
      } else {
        const found = compiled[githubUsername].find(obj => obj.labels === entry.labels)
        if (!found) {
          compiled[githubUsername].push(entry)
        }
      }
    }
    return {
      uniqueQueue: compiled,
      deleteFromQueueOperations
    }
  } catch (e) {
    console.log('============================== [Logic: getUniqueQueueEntries]')
    console.log(e)
    throw e
  }
}

// ///////////////////////////////////////////////// convertQueueToNotifications
const convertQueueToNotifications = async (queue) => {
  try {
    const users = Object.keys(queue)
    const lenI = users.length
    const notificationsToCreate = {} // new notifications to be pushed, grouped by githubUsername
    for (let i = 0; i < lenI; i++) {
      const githubUsername = users[i]
      notificationsToCreate[githubUsername] = { operations: [] }
      // Need to fetch the user in order to be able to grab their latest notification
      console.log('❓ username: ', githubUsername)
      const user = await FindUser({ githubUsername })
      if (!user) { continue }
      const ownerId = user._id
      notificationsToCreate[githubUsername].userId = ownerId
      // Fetch latest notification and compare labels. If they're the same, do nothing.
      // This is to prevent a duplicate notification from being pushed
      let latestNotification = await MC.model.Notification
        .find({ ownerId })
        .sort({ createdAt: -1 })
        .limit(1)
        .lean()
      latestNotification = latestNotification[0]
      console.log('❓ latest', latestNotification)
      // Loop through all unique potential notifications and compile an operations list for bulkWrite
      const potentialNotifications = queue[githubUsername]
      const lenJ = potentialNotifications.length
      for (let j = 0; j < lenJ; j++) {
        const potentialNotification = potentialNotifications[j]
        // Don't do anything if the latest notification's labels are identical to the first potential incoming notification
        const notificationSameAsLastOne = latestNotification && latestNotification.custom.state === potentialNotification.state
        console.log('⚡️', latestNotification && latestNotification.custom.state, potentialNotification.state)
        if (j === 0 && notificationSameAsLastOne) {
          console.log('❗️ SAME NOTIFICATION AS THE LAST ONE', potentialNotification)
          continue
        } else {
          notificationsToCreate[githubUsername].operations.push({
            insertOne: {
              document: {
                ownerId,
                bucket: 'application',
                custom: potentialNotification
              }
            }
          })
        }
      }
    }
    console.log('❓ create operations', notificationsToCreate)
    return notificationsToCreate
  } catch (e) {
    console.log('======================== [Logic: convertQueueToNotifications]')
    console.log(e)
    throw e
  }
}

// /////////////////////////////////////////////////// performDatabaseOperations
const performDatabaseOperations = async (notificationsToCreate, deleteFromQueueOperations) => {
  try {
    const users = Object.keys(notificationsToCreate)
    const lenI = users.length
    let createdCount = 0
    const userIds = []
    for (let i = 0; i < lenI; i++) {
      const githubUsername = users[i]
      const userId = notificationsToCreate[githubUsername].userId
      const operations = notificationsToCreate[githubUsername].operations
      const created = await MC.model.Notification.bulkWrite(operations)
      createdCount += created.nInserted
      userIds.push(userId)
    }
    const deleted = await MC.model.ApplicationChangedQueue.bulkWrite(deleteFromQueueOperations)
    console.log(`New notifications: ${(createdCount || 0).toLocaleString()} | deleted: ${(deleted || 0).nRemoved.toLocaleString()}`)
    return userIds
  } catch (e) {
    console.log('========================== [Logic: performDatabaseOperations]')
    console.log(e)
    throw e
  }
}

// //////////////////////////////////////////////////////// refreshNotifications
const refreshNotifications = (socket, userIds) => {
  userIds.forEach((userId) => {
    console.log(userId)
    socket.emit('script|refresh-notifications|initialize', `${userId}`)
  })
}

// /////////////////////////////////////////////// ApplicationNotificationParser
const ApplicationNotificationParser = async (socket) => {
  console.log('run')
  try {
    const queue = await MC.model.ApplicationChangedQueue
      .find()
      .sort({ createdAt: 1 })
      .select('-createdAt -updatedAt -__v')
      .lean()
    console.log(queue)
    if (queue.length === 0) {
      TIMEOUT = setTimeout(() => {
        ApplicationNotificationParser(socket)
        clearTimeout(TIMEOUT)
      }, 1000)
      return
    }
    const { uniqueQueue, deleteFromQueueOperations } = await getUniqueQueueEntries(queue)
    console.log('❓ unique', uniqueQueue)
    console.log('❓ delete', deleteFromQueueOperations)
    const notificationsToCreate = await convertQueueToNotifications(uniqueQueue)
    const userIds = await performDatabaseOperations(notificationsToCreate, deleteFromQueueOperations)
    await refreshNotifications(socket, userIds)
    ApplicationNotificationParser(socket)
  } catch (e) {
    console.log('======================= [💣: ApplicationNotificationParser]')
    console.log(e)
    ApplicationNotificationParser(socket)
  }
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
MC.app.on('mongoose-connected', async () => {
  await GenerateWebsocketClient((socket) => {
    console.log('🤖 ApplicationNotificationParser bot engaged')
    clearTimeout(TIMEOUT)
    ApplicationNotificationParser(socket)
  })
})
