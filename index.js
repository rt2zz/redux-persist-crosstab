var constants = require('redux-persist/constants')
var KEY_PREFIX = constants.KEY_PREFIX

module.exports = function(persistor, config){
  var config = config || {}
  var blacklist = config.blacklist || false
  var whitelist = config.whitelist || false
  var keyPrefix = config.keyPrefix || KEY_PREFIX

  window.addEventListener('storage', handleStorageEvent, false)

  function handleStorageEvent(e){
    if(e.key && e.key.indexOf(keyPrefix) === 0){
      var keyspace = e.key.substr(keyPrefix.length)
      if(whitelist && whitelist.indexOf(keyspace) === -1){ return }
      if(blacklist && blacklist.indexOf(keyspace) !== -1){ return }
      if(e.oldValue === e.newValue){ return }

      var statePartial = {}
      statePartial[keyspace] = e.newValue
      persistor.rehydrate(statePartial, {serial: true})
    }
  }
}
