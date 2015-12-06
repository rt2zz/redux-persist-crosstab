var generateUuid = require('generate-uuid');
var constants = require('redux-persist/constants');
var keyPrefix = constants.keyPrefix;

module.exports = function(persistor, config) {
  var newConfig = config || {};
  var blacklist = newConfig.blacklist || false;
  var whitelist = newConfig.whitelist || false;

  var guid = generateUuid();
  var isFocused = (document.hasFocus) ? document.hasFocus() : true;
  var others = {};

  var props = {
    isMaster: false,
    checkTimeout: null,
    pingTimeout: null
  }

  var control = {
    check: function () {
      var now = +new Date(), takeMaster = true, id;
      for (id in others) {
        if (others[id] + 23000 < now) {
          delete others[id];
        } else if (id < guid) {
          takeMaster = false;
        }
      }

      if (props.isMaster !== takeMaster) {
        props.isMaster = takeMaster;
        this.masterDidChange();
      }
      console.log('check::: ', now, props.isMaster);
    },
    ping: function (event) {
      others[event.id] = +new Date();
      console.log('ping', others);
    },
    hello: function (event) {
      this.ping(event);
      if (event.id < guid) {
        this.check();
      } else {
        this.broadcast('ping');
      }
    },
    bye: function (event) {

    },
    broadcast: function (type, data) {
      var event = { id: guid, type: type };

      for (var x in data) {
        event[x] = data[x];
      }

      try {
        localStorage.setItem('broadcast', JSON.stringify(event));
      } catch (error) {
        console.log(error);
      }
      console.log('broadcast::: ', type, data, JSON.stringify(event));
    },
    masterDidChange: function () {
      console.log('masterDidChange', guid);
    }
  };

  var events = {
    focus: function () {
      isFocused = !isFocused;
      console.log('events.focus', isFocused);
    },
    destroy: function () {
      window.removeEventListener('focus', this.focus, false);
      window.removeEventListener('blur', this.focus, false);
      window.removeEventListener('storage', this.storage, false);
      window.removeEventListener('unload', this.destroy, false);
    },
    storage: function (event) {
      //if (isFocused) return;

      console.log('isFocused::: ', isFocused);
      console.log('handleStorageEvent::: key ', event.key);
      console.log('handleStorageEvent::: oldValue ', event.oldValue);
      console.log('handleStorageEvent::: newValue ', event.newValue);

      switch (event.type) {
        case 'storage':
          if (event.key === 'broadcast') {
            try {
              var data = JSON.parse(event.newValue);
              console.log('BROADCAST DATA::: ', data);
              if (data.id !== guid) {
                control[data.type](data);
              }
            } catch (error) {
              console.log(error);
            }
          }

          if (event.key.indexOf(keyPrefix) === 0) {
            var keyspace = event.key.substr(keyPrefix.length);
            if (whitelist && whitelist.indexOf(keyspace) === -1) { return; }
            if (blacklist && blacklist.indexOf(keyspace) !== -1) { return; }
            // rehydrate storage with the new value
            persistor.rehydrate(keyspace, event.newValue, function (key, state) {
              // @TODO handle errors?
            });
          }
          break;
        case 'unload':
          destroy();
          break;
      };
    }
  };

  var timeout = {
    check: function () {
      control.check();
      props.checkTimeout = setTimeout(timeout.check, 9000);
    },
    ping: function () {
      control.broadcast('ping');
      props.pingTimeout = setTimeout(timeout.ping, 17000);
    }
  };

  window.addEventListener('focus', events.focus, false);
  window.addEventListener('blur', events.focus, false);
  window.addEventListener('unload', events.destroy, false);
  window.addEventListener('storage', events.storage, false);

  props.checkTimeout = setTimeout(timeout.check, 500);
  props.pingTimeout = setTimeout(timeout.ping, 17000);

  control.broadcast('hello');
};
