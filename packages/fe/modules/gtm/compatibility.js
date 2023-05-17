const chalk = require('chalk')
const semver = require('semver')

function requireNuxtVersion (nuxt, version) {
  const pkgName = require('../package.json').name
  const currentVersion = semver.coerce(nuxt.constructor.version)
  const requiredVersion = semver.coerce(version)

  if (semver.lt(currentVersion, requiredVersion)) {
    throw new Error(`\n
      ${chalk.cyan(pkgName)} is not compatible with your current Nuxt version : ${chalk.yellow('v' + currentVersion)}\n
      Required: ${chalk.green('v' + requiredVersion)} or ${chalk.cyan('higher')}
    `)
  }
}

module.exports = {
  requireNuxtVersion
}
