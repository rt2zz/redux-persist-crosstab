var constants = require('redux-persist/constants');
var keyPrefix = constants.keyPrefix;

module.exports = function(persistor, config) {
  var newConfig = config || {};
  var blacklist = newConfig.blacklist || false;
  var whitelist = newConfig.whitelist || false;
  var isFocused = (document.hasFocus) ? document.hasFocus() : true;

  window.addEventListener('focus', function () {
    isFocused = true;
  }, false);

  window.addEventListener('blur', function () {
    isFocused = false;
  }, false);

  window.addEventListener('storage', function (event) {
    if (isFocused || !event.newValue) return;

    if (event.key.indexOf(keyPrefix) === 0) {
      var keyspace = event.key.substr(keyPrefix.length);
      if (whitelist && whitelist.indexOf(keyspace) === -1) { return; }
      if (blacklist && blacklist.indexOf(keyspace) !== -1) { return; }

      persistor.rehydrate(keyspace, event.newValue, function (oldState, newState) {
        // @TODO handle errors?
      });
    }
  }, false);
}
