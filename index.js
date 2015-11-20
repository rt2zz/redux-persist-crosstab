var constants = require('redux-persist/constants');
var keyPrefix = constants.keyPrefix;

module.exports = function (persistor, config) {
  var newConfig = config || {};
  var blacklist = newConfig.blacklist || false;
  var whitelist = newConfig.whitelist || false;

  window.addEventListener('storage', handleStorageEvent, false);

  function handleStorageEvent(e) {
    if (e.key.indexOf(keyPrefix) === 0) {
      var keyspace = e.key.substr(keyPrefix.length);
      if (whitelist && whitelist.indexOf(keyspace) === -1) { return; }
      if (blacklist && blacklist.indexOf(keyspace) !== -1) { return; }

      persistor.rehydrate(keyspace, e.newValue, function () {
        //@TODO handle errors?
      })
    }
  }
}
