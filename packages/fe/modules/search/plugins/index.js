/*
 *
 * 🔌 [plugin | search] index
 *
 */

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

import Store from '@/modules/search/store'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////////// registerStore
const registerStore = (store, next) => {
  return new Promise((next) => {
    store.registerModule('search', Object.assign({
      namespaced: true
    }, Store))
    next()
  })
  if (next) { return next() }
}

// ///////////////////////////////////////////////////////////// resetFormFields
const resetFormFields = async (items) => { // items = [{ id: '', resetTo: ''|undefined }]
  const len = items.length
  for (let i = 0; i < len; i++) {
    const item = items[i]
    /**
      * This event is caught by the form module's field-standalone.vue component in its mounted() hook.
      * @arg {object} payload
      *   @param {string} id This id is passed to <FieldContainer> as a "resetGroupId" scaffold key. All fields with this id will be reset.
      *   @param {string} resetTo 'nullState' or 'defaultValue'. Setting this will override the field-level resetTo value. DO NOT leave as an empty string.
      */
    window.$nuxt.$emit('resetFormFields', item)
  }
}

// ///////////////////////////////////////////////// ApplyMultipleFiltersToQuery
/**
 * This function only works for query-based filters
 */
const ApplyMultipleFiltersToQuery = async (app, payload) => {
  const filters = payload.filters
  const redirect = payload.redirect
  const query = CloneDeep(app.router.history.current.query)
  const queryBefore = CloneDeep(query)
  const len = filters.length
  for (let i = 0; i < len; i++) {
    const filterKey = filters[i]
    const filter = await app.$filter(filterKey).get()
    if (filter) {
      const value = filter.queued
      query[filterKey] = !value && query[filterKey] ? undefined : value
    }
  }
  if (JSON.stringify(queryBefore) !== JSON.stringify(query)) {
    app.router.push({
      ...(redirect && { path: redirect }),
      query,
      hash: location.hash
    })
  }
  await app.$delay(10)
}

// /////////////////////////////////////////////////////// ClearSearchAndFilters
const ClearSearchAndFilters = async (app, payload) => {
  try {
    const searchers = payload.searchers || []
    let filterers = payload.filters.clear || []
    searchers.forEach(searcher => app.$search(searcher).clear())
    filterers.forEach(filterer => app.$filter(filterer).clear())
    filterers = filterers.concat(payload.filters.override || [])
    app.$applyMultipleFiltersToQuery({ filters: filterers })
    if (payload.resetFormFields) {
      await resetFormFields(payload.resetFormFields)
    }
  } catch (e) {
    console.log('========================== [Plugin: $clearSearchAndFilters]')
    console.log(e)
  }
}

// //////////////////////////////////////////////// CheckIfFilterSelectionsExist
const CheckIfFilterSelectionsExist = async (app, filters) => {
  let selelectionsExist = false
  filters.forEach((filterKey) => {
    if (!app.$filter(filterKey).isEmpty()) {
      selelectionsExist = true
    }
  })
  return selelectionsExist
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function ({ app, store, route }, inject) {
  await registerStore(store)
  inject('applyMultipleFiltersToQuery', (filters) => ApplyMultipleFiltersToQuery(app, filters))
  inject('clearSearchAndFilters', (filters) => ClearSearchAndFilters(app, filters))
  inject('checkIfFilterSelectionsExist', (filters) => CheckIfFilterSelectionsExist(app, filters))
}
