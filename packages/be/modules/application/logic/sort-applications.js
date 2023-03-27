// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
module.exports = async (applications, sort) => {
  if (sort === 'newest_first') {
    return applications.sort((a, b) => {
      return a.created_at > b.created_at ? -1 : 1
    })
  }
  // else, sort by 'open_first'
  return applications.sort((a, b) => {
    if (a.state === b.state) {
      return a.created_at > b.created_at ? -1 : 1
    } else {
      return a.state > b.state ? -1 : 1
    }
  })
}
