var constants = require('redux-persist/constants')
var keyPrefix = constants.keyPrefix

module.exports = function(persistor, config){
  var config = config || {}
  var blacklist = config.blacklist || []

  window.addEventListener('storage', handleStorageEvent, false)

  function handleStorageEvent(e){
    if(e.key.indexOf(keyPrefix) === 0){
      var keyspace = e.key.substr(keyPrefix.length)
      if(config.blacklist.indexOf(keyspace) === -1){
        persistor.rehydrate(keyspace, e.newValue, function(){
          //@TODO handle errors?
        })
      }
    }
  }
}
