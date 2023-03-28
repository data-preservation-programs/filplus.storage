/*
 *
 * 🔌 [plugin | search] filterer
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ===================================================== getCurrentFilterIndexes
/**
 * returns array of filterer indexes
 *
 * route example: /?new=true&region=us,ca
 * returns: [0] and [2, 6]
 * @param {*} route
 * @param refresh upon registration, don't refresh value (pass through default). On refresh, get value from query.
 */
const getFilterIndexesFromQuery = (route, refresh, filterKey, options, defaultSelection, isSingleSelection, isSingleOption) => {
  return new Promise((resolve) => {
    let query = route.query[filterKey]
    if (!query) {
      // If it's an initial registration (not a refresh) OR if it's a refresh together
      // with a single-option then pass back the default value if one is set (re: not -1)
      if (!refresh || (refresh && isSingleSelection)) {
        return resolve(defaultSelection === -1 ? [] : [defaultSelection])
      }
      return resolve([])
    }
    query = isSingleSelection ? [query] : query.split(',')
    const selected = []
    query.forEach((item) => {
      if (isSingleOption) {
        if (item === `${options[0].value[1]}`) { // value[0] = unselected, value [1] = selected
          selected.push(0)
        }
      } else {
        const index = options.findIndex(option => item === `${option.value}`)
        if (index !== -1) {
          selected.push(index)
        }
      }
    })
    resolve(selected)
  })
}

// ========================================= convertSelectedIndexesToQueryString
const convertSelectedIndexesToQueryString = (selected, options, isSingleOption) => {
  return new Promise((resolve) => {
    const len = selected.length
    if (isSingleOption) {
      const value = options[0].value
      return resolve(len === 0 ? value[0] : value[1]) // value[0] = unselected, value [1] = selected
    }
    let query = ''
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        const value = options[selected[i]].value
        query += i === 0 ? value : `,${value}`
      }
    }
    resolve(query !== '' ? query : undefined)
  })
}

// =================================================================== runChecks
const runChecks = (filterKey, options, isSingleSelection, isSingleOption) => {
  return new Promise((resolve, reject) => {
    const prefix = `\n\n\tFilter: ${filterKey}\n\t`
    const suffix = '\n\n'
    if (isSingleSelection && isSingleOption) {
      const value = options[0].value
      if (!Array.isArray(value)) {
        return reject(`${prefix}An isSingleSelection filter that subsequently only has 1 option (it is effectively a toggle) must have a value key that is an array with exactly two strings (used for toggling). Example: value: ['open','closed']${suffix}`)
      } else if (value.length !== 2) {
        return reject(`${prefix}An isSingleSelection filter\'s value key must be an array with exactly 2 strings (used for toggling). Example: value: ['open','closed']${suffix}`)
      }
    }
    resolve()
  })
}

// ////////////////////////////////////////////////////////////// [Class] Filter
// -----------------------------------------------------------------------------
const Filter = (app, store, filterKey) => {
  const route = app.router.history.current
  let filterer = store.getters['search/filters'].find(filterer => filterer.filterKey === filterKey)
  return {
    // ================================================================ register
    async register (options, defaultSelection, isSingleSelection, action) {
      if (!filterer) {
        const isSingleOption = options.length === 1
        await runChecks(filterKey, options, isSingleSelection, isSingleOption)
        let selected = []
        switch (action) {
          // case 'emit' : selected = this.filterValue; break
          // case 'store' : selected = this.$store.getters[this.storeGetter]; break
          case 'query' : selected = await getFilterIndexesFromQuery(route, false, filterKey, options, defaultSelection, isSingleSelection, isSingleOption); break
        }
        await this.set({
          filterKey,
          options,
          isSingleSelection,
          isSingleOption,
          action,
          defaultSelection,
          selected, // list of indexes
          queued: await this.convert(action, selected, options, isSingleOption),
          originalSelected: selected // lock in the original selection upon registration
        })
      }
    },

    // ============================================================== deregister
    async deregister () {
      if (filterer) {
        await store.dispatch('search/removeFilter', filterKey)
      }
    },

    // ===================================================================== get
    get () {
      return filterer
    },

    // ===================================================================== set
    async set (incoming) {
      await store.dispatch('search/setFilter', Object.assign(CloneDeep(filterer || {}), incoming))
      filterer = store.getters['search/filters'].find(filterer => filterer.filterKey === filterKey)
    },

    // ===================================================== getSelectionOptions
    getSelectionOptions () {
      if (!filterer) { return [] }
      const options = CloneDeep(filterer.options)
      let selected = filterer.selected
      const len = selected.length
      const compiled = []
      for (let i = 0; i < len; i++) {
        const index = selected[i]
        compiled.push(Object.assign(options[index], {
          filterKey,
          index
        }))
      }
      return compiled
    },

    // ============================================================= updateQuery
    async updateQuery (filterKey, value) {
      const query = CloneDeep(route.query)
      query[filterKey] = value
      // need to pass location.hash in to retain the current url hash
      app.router.push({ query, hash: location.hash })
      /**
       * TODO: refactor this so it's not a timeout. We need this so that the
       * query updates BEFORE moving on to doing things like refreshing data.
       * Look up the '$route' watcher function in Nuxt src
       */
      await app.$delay(10)
    },

    // ================================================================= convert
    async convert (action, selected, options, isSingleOption) {
      let converted
      switch (action) {
        // case 'emit' : payload.instance.$emit(value); break
        // case 'store' : await store.dispatch(storeAction, value); break
        case 'query' : converted = await convertSelectedIndexesToQueryString(selected, options || filterer.options, isSingleOption); break
      }
      return converted
    },

    // ===================================================================== for
    async for (term) {
      if (!filterer) { return }
      let selected = CloneDeep(filterer.selected)
      const index = term.index
      const existing = selected.findIndex(option => option === index) // incoming index is already selected (if not -1)
      const isSingleSelection = filterer.isSingleSelection
      if (isSingleSelection) {
        selected = index === -1 ? [] : [index]
      } else {
        existing === -1 ? selected.push(index) : selected.splice(existing, 1)
      }
      await this.set({
        selected,
        queued: await this.convert(filterer.action, selected, undefined, filterer.isSingleOption)
      })
      if (process.client) {
        window.$nuxt.$emit('updateFormField', {
          id: filterKey,
          value: isSingleSelection ? selected[0] : selected
        })
      }
      if (term.live) {
        await this.apply(term)
      }
    },

    // =================================================================== apply
    async apply () {
      switch (filterer.action) {
        // case 'emit' : payload.instance.$emit(value); break
        // case 'store' : await store.dispatch(storeAction, value); break
        case 'query' : await this.updateQuery(filterKey, filterer.queued); break
      }
    },

    // ================================================================= refresh
    async refresh (route) {
      const selected = await getFilterIndexesFromQuery(
        route,
        true,
        filterKey,
        filterer.options,
        filterer.defaultSelection,
        filterer.isSingleSelection,
        filterer.isSingleOption
      )
      await this.set({
        queued: await this.convert(filterer.action, selected, undefined, filterer.isSingleOption),
        selected
      })
    },

    // =================================================================== clear
    async clear () {
      if (!filterer) { return }
      this.set({ selected: [], queued: undefined })
    },

    // ================================================================= isEmpty
    isEmpty () {
      if (!filterer) { return true }
      return filterer.selected.length === 0
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default function ({ app, store }, inject) {
  inject('filter', (filterKey) => Filter(app, store, filterKey))
}
