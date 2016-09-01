var constants = require('redux-persist/constants')
var KEY_PREFIX = constants.KEY_PREFIX

module.exports = function(persistor, config){
  var config = config || {}
  var blacklist = config.blacklist || false
  var whitelist = config.whitelist || false

  window.addEventListener('storage', handleStorageEvent, false)

  function handleStorageEvent(e){
    if(e.key.indexOf(KEY_PREFIX) === 0){
      var keyspace = e.key.substr(KEY_PREFIX.length)
      if(whitelist && whitelist.indexOf(keyspace) === -1){ return }
      if(blacklist && blacklist.indexOf(keyspace) !== -1){ return }

      var statePartial = {}
      statePartial[keyspace] = e.newValue
      persistor.rehydrate(statePartial, {serial: true})
    }
  }
}
