# Redux Persist Crosstab
Add cross tab syncing to your [redux](https://github.com/gaearon/redux) app with 1 line. This tiny module listens to the window for [redux-persist](https://github.com/rt2zz/redux-persist) storage events. When an event occurs it will dispatch a rehydrate action.

```js
import { createStore, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import crosstabSync from 'redux-persist-crosstab'
const finalCreateStore = compose(autoRehydrate())(createStore)
const store = finalCreateStore(reducer)

const persistor = persistStore(store, {})
crosstabSync(persistor)
```

To blacklist some portion of state, for example if you want to avoid syncing route state:
```js
crosstabSync(persistor, {blacklist: ['routeReducerKey']})
```
