// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (labels, applicationType) => {
  try {
    const completedRegex = { ga: /(state:)?\s?granted/gi, lda: /total\s?datacap\s?reached/gi }
    const validatedRegex = { ga: /(bot:)?\s?looking\s?good/gi, lda: /validated/ }
    const inReviewRegex = { ga: /(state)|(bot)?:\s?(further\s?info)?(review)?\s?needed/gi, lda: /error/ }

    // the labels data returned from github is an array of objects with the label's name in the name property
    // during standup you said an array of strings? if it's an array of strings this should be label.match(regex)
    const hasLabel = labels.some((label, regex) => { return label.name.match(regex) })

    const completed = hasLabel(labels, completedRegex[applicationType])
    const validated = hasLabel(labels, validatedRegex[applicationType])
    const inReview = hasLabel(labels, inReviewRegex[applicationType])

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
