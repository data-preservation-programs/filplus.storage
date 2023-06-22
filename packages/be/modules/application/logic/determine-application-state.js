// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const HasLabel = require('@Module_Application/logic/has-label')

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (labels, applicationType) => {
  try {
    const completedRegex = { ga: /(state:)?\s?granted/gi, lda: /total\s?datacap\s?reached/gi }
    const validatedRegex = { ga: /(bot:)?\s?looking\s?good/gi, lda: /validated/ }
    const inReviewRegex = { ga: /(state)|(bot)?:\s?(further\s?info)?(review)?\s?needed/gi, lda: /error/ }

    const completed = HasLabel(labels, completedRegex[applicationType])
    const validated = HasLabel(labels, validatedRegex[applicationType])
    const inReview = HasLabel(labels, inReviewRegex[applicationType])

    return completed ? 'completed'
      : validated ? 'validated'
        : inReview ? 'inReview'
          : 'noRelevantLabels'
  } catch (e) {
    console.log('========================== [Logic: DetermineApplicationState]')
    console.log(e)
    throw e
  }
}
