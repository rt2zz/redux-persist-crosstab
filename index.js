import { KEY_PREFIX, REHYDRATE } from 'redux-persist/lib/constants'

module.exports = function (store, persistConfig, crosstabConfig = {}) {
  const blacklist = crosstabConfig.blacklist || null
  const whitelist = crosstabConfig.whitelist || null
  const keyPrefix = crosstabConfig.keyPrefix || KEY_PREFIX

  const { key } = persistConfig

  window.addEventListener('storage', handleStorageEvent, false)

  function handleStorageEvent (e) {
    if (e.key && e.key.indexOf(keyPrefix) === 0) {
      if (e.oldValue === e.newValue) {
        return
      }

      const statePartial = JSON.parse(e.newValue)

      const state = Object.keys(statePartial).reduce((state, reducerKey) => {
        if (whitelist && whitelist.indexOf(reducerKey) === -1) {
          return state
        }
        if (blacklist && blacklist.indexOf(reducerKey) !== -1) {
          return state
        }

        state[reducerKey] = JSON.parse(statePartial[reducerKey])

        return state
      }, {})

      store.dispatch({
        key,
        payload: state,
        type: REHYDRATE,
      })
    }
  }
}
