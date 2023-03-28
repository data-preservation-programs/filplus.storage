/*
 *
 * 🔌 [plugin | search] index
 *
 */

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

import NuxtMiddleware from '../middleware' // This resolves to .nuxt/middleware.js
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

// ////////////////////////////////////////////////////////// registerMiddleware
const registerMiddleware = () => {
  return new Promise((next) => {
    import('@/modules/search/middleware/filter')
      .then((middleware) => {
        NuxtMiddleware.filter = middleware.default
        return next()
      })
  })
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
    searchers.forEach(id => app.$search(id).clear())
    filterers.forEach(id => app.$filter(id).clear())
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

// ///////////////////////////////////////////// ExportSearchAndFiltersFromQuery
const ExportSearchAndFiltersFromQuery = async (app, paramsToCompile) => {
  const params = {}
  const query = app.router.history.current.query
  const len = paramsToCompile.length
  for (let i = 0; i < len; i++) {
    const paramToCompile = paramsToCompile[i]
    const filterKey = paramToCompile.filterKey
    const searchKey = paramToCompile.searchKey
    const queryKey = paramToCompile.queryKey
    const key = filterKey || searchKey || queryKey
    const compileGroup = paramToCompile.group
    const defaultOverride = paramToCompile.default
    const filter = await app.$filter(filterKey).get()
    const searcher = await app.$search(searchKey).get()
    // First try to grab the value from the registered filter/search entity itself
    let value
    if (filter) {
      value = await app.$filter(filterKey).convert('query', filter.selected, filter.options, filter.isSingleOption)
    } else if (searcher) {
      value = searcher.value
    }
    // Otherwise, try to grab the value from the query and lastly pass through a
    // default if one is set
    value = await app.$parseNumber(
      value || query[key] || defaultOverride,
      true
    )
    if (value !== undefined) { // don't compile filters that don't exist
      if (!compileGroup) { // compile as a string, (ex: page: '1')
        params[key] = value
      } else { // compile as an object, (ex: filters: { categories: '', licenses: '' })
        if (!params.hasOwnProperty(compileGroup)) {
          params[compileGroup] = { [key]: value }
        } else {
          params[compileGroup][key] = value
        }
      }
    }
  }
  return { params, query }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async function ({ app, store }, inject) {
  await registerStore(store)
  await registerMiddleware()
  inject('applyMultipleFiltersToQuery', (filters) => ApplyMultipleFiltersToQuery(app, filters))
  inject('clearSearchAndFilters', (filters) => ClearSearchAndFilters(app, filters))
  inject('checkIfFilterSelectionsExist', (filters) => CheckIfFilterSelectionsExist(app, filters))
  inject('exportSearchAndFiltersFromQuery', (filters) => ExportSearchAndFiltersFromQuery(app, filters))
}
