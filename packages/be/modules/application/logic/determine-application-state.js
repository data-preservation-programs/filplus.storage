// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const HasLabel = require('@Module_Application/logic/has-label')

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = (labels, applicationType) => {
  try {
    const completedRegex = { ga: /(state:)?\s?granted/gi, lda: /total\s?datacap\s?reached/gi }
    const validatedRegex = { ga: /(bot:)?\s?looking\s?good/gi, lda: /validated/ }
    const reviewingRegex = { ga: /(state)|(bot)?:\s?(further\s?info)?(review)?\s?needed/gi, lda: /error/ }

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
    throw e
  }
}
