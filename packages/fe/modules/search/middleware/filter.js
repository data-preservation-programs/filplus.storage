// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
export default async (ctx) => {
  if (!process.client) { return }
  const { app, from, route: to, store } = ctx
  if (!from || !to) { return }
  const beforeQuery = from.query
  const afterQuery = to.query
  const filters = await store.getters['search/filters']
  let len = filters.length
  const diff = []
  for (let i = 0; i < len; i++) {
    const filter = filters[i]
    const filterKey = filter.filterKey
    if (beforeQuery[filterKey] !== afterQuery[filterKey]) {
      diff.push(filter)
    }
  }
  len = diff.length
  const applied = []
  for (let i = 0; i < len; i++) {
    let filter = diff[i]
    const filterKey = filter.filterKey
    await app.$filter(filterKey).refresh(to)
    filter = await app.$filter(filterKey).get()
    const selected = filter.selected
    applied.push({
      id: filterKey,
      value: await app.$filter(filterKey).convert('query', filter.selected, filter.options, filter.isSingleOption),
      live: true
    })
    window.$nuxt.$emit('updateFormField', {
      id: filterKey,
      value: filter.isSingleSelection ? selected[0] : selected
    })
  }
  /**
    * This event is used to globally notify the app when one or more filters have
    * been applied. In this case, due to a route change.
    * @param {object} payload contains live and filter keys
    *  @param {string} payload.live depicts whether or not the filter is applied instantly
    *  @param {string} payload.filters list of filters that changed upon route change
    */
  window.$nuxt.$emit('filtersApplied', {
    live: true,
    filters: applied
  })
}
