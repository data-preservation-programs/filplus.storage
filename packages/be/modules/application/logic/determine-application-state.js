// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const HasLabel = require('@Module_Application/logic/has-label')

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = (labels, applicationType) => {
  try {
    const completedRegex = { ga: /^[\s\t]*(state:)?\s*granted[\s\t]*$/gi, lda: /^[\s\t]*total\s?datacap\s?reached[\s\t]*$/gi }
    const validatedRegex = { ga: /^[\s\t]*(bot:)?\s*looking\s?good[\s\t]*$/gi, lda: /validated/ }
    const reviewingRegex = { ga: /^[\s\t]*([sb][to]a?te?)?:\s*(further\s?info)?(review)?\s?needed[\s\t]*$/gi, lda: /error/ }

    const completed = HasLabel(labels, completedRegex[applicationType])
    const validated = HasLabel(labels, validatedRegex[applicationType])
    const reviewing = HasLabel(labels, reviewingRegex[applicationType])

    return completed ? 'completed'
      : validated ? 'validated'
        : reviewing ? 'reviewing'
          : 'noRelevantLabels'
  } catch (e) {
    console.log('========================== [Logic: DetermineApplicationState]')
    console.log(e)
    return null
  }
}
