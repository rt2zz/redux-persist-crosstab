var constants = require('redux-persist/constants')
var keyPrefix = constants.keyPrefix

module.exports = function(persistor, config){
  var config = config || {}
  var blacklist = config.blacklist || false
  var whitelist = config.whitelist || false

  window.addEventListener('storage', handleStorageEvent, false)

  function handleStorageEvent(e){
    if(e.key.indexOf(keyPrefix) === 0){
      var keyspace = e.key.substr(keyPrefix.length)
      if(whitelist && whitelist.indexOf(keyspace) === -1){ return }
      if(blacklist && blacklist.indexOf(keyspace) !== -1){ return }

      var statePartial = {}
      statePartial[keyspace] = e.newValue
      persistor.rehydrate(statePartial, function(){
        //@TODO handle errors?
      })
    }
  }
}
