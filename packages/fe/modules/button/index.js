/*
 *
 * 📦 [module] button
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'

// ///////////////////////////////////////////////////////////////////// Plugins
const IndexPlugin = Path.resolve(__dirname, 'plugins/index.js')
const ButtonPlugin = Path.resolve(__dirname, 'plugins/button.js')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////////////// registerPlugin
const registerPlugin = (instance, next) => {
  return new Promise((next) => {
    const plugins = [
      { src: IndexPlugin, fileName: 'button/plugin-index.js' },
      { src: ButtonPlugin, fileName: 'button/plugin-button.js' }
    ]
    plugins.forEach((plugin) => {
      const dst = instance.addTemplate({ src: plugin.src, fileName: plugin.fileName }).dst
      instance.options.plugins.push({
        src: Path.join(instance.options.buildDir, dst),
        ssr: plugin.mode,
        mode: plugin.mode
      })
    })
    next()
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function () {
  await registerPlugin(this)
}
