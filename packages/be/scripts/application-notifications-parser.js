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
      // All entries processes in this run of ApplicationNotificationParser should be deleted at the end
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
      const ownerId = user._id
      if (!user) { continue }
      notificationsToCreate[githubUsername].userId = ownerId
      // Fetch latest notification and compare labels. If they're the same, do nothing.
      // This is to prevent a duplicate notification from being pushed
      const latestNotification = await MC.model.Notification
        .find({ ownerId })
        .sort({ createdAt: -1 })
        .lean()[0]
      console.log('❓ latest', latestNotification)
      // Loop through all unique potential notifications and compile an operations list for bulkWrite
      const potentialNotifications = queue[githubUsername]
      const lenJ = potentialNotifications.length
      for (let j = 0; j < lenJ; j++) {
        const potentialNotification = potentialNotifications[j]
        // Don't do anything if the latest notification's labels are identical to the first potential incoming notification
        if (j === 0 && latestNotification && latestNotification.custom.labels === potentialNotification.labels) {
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
    console.log(`New notifications: ${createdCount.toLocaleString()} | deleted: ${deleted.nRemoved}`)
    return userIds
  } catch (e) {
    console.log('========================== [Logic: performDatabaseOperations]')
    console.log(e)
    throw e
  }
}

const refreshNotifications = (socket, userIds) => {
  userIds.forEach((userId) => {
    console.log(userId)
    socket.emit('script|refresh-notifications|initialize', `${userId}`)
  })
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
MC.app.on('mongoose-connected', async () => {
  console.log('🤖 ApplicationNotificationParser bot engaged')
  await GenerateWebsocketClient(async (socket) => {
    try {
      const queue = await MC.model.ApplicationChangedQueue
        .find()
        .sort({ createdAt: 1 })
        .select('-createdAt -updatedAt -__v')
        .lean()
      console.log(queue)
      if (queue.length === 0) { process.exit(0) }
      const { uniqueQueue, deleteFromQueueOperations } = await getUniqueQueueEntries(queue)
      console.log('❓ unique', uniqueQueue)
      console.log('❓ delete', deleteFromQueueOperations)
      // await convertQueueToNotifications(uniqueQueue)
      const notificationsToCreate = await convertQueueToNotifications(uniqueQueue)
      const userIds = await performDatabaseOperations(notificationsToCreate, deleteFromQueueOperations)
      await refreshNotifications(socket, userIds)
    } catch (e) {
      console.log('========================= [💣: ApplicationNotificationParser]')
      console.log(e)
    }
    process.exit(0)
  })
})
