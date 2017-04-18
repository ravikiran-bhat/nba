  'use strict';
  module.exports = [
    '$rootScope',
    '$cacheFactory',
    '$q',
    'relayService',
    '$timeout',
    function($rootScope, $cache, $q, Relay, $timeout) {
      var caches = [];
      var that = this;
      var appCache = $cache('appCache');
    

      this.then = function(cacheKey, promise) {
        return promise.then(function(data) {
          that.set(cacheKey, data);
          return data;
        }, function(error) {
          return $q.reject(error);
        });
      }

      this.set = function(cacheKey, data) {
        var val = appCache.put(cacheKey, data);
        caches.push(cacheKey);
        //$timeout(function(){
          Relay.send(cacheKey, {
            data: data,
            set: true
          });
       // }, 1000)
        var b = appCache.get(cacheKey);
        return val;
      }

      this.get = function(cacheKey) {
        return appCache.get(cacheKey);
      }

      this.getInfo = function() {
        return appCache.info();
      }

      this.remove = function() {

        var cacheKeys = arguments instanceof Array ? arguments : Array.prototype.slice.call(arguments, 0);

        
        var values = [];
        for (var i = 0; i < cacheKeys.length; i++) {
          values.push(appCache.remove(cacheKeys[i]));
          caches.splice(_.indexOf(caches, cacheKeys[i]), 1);
          //$timeout(function(){
            Relay.send(cacheKeys[i], {
              remove: true
            });
        //  }, 100)
        };

        if (values.length === 1) {
          return cacheKeys[0];
        } else {
          return values;
        }
      }

      this.removeAll = function() {
        appCache.removeAll();
        for (var i = 0; i < caches.length; i++) {
          Relay.send(caches[i], {
            remove: true
          });
        };
        caches.length = 0;
        caches = [];
        return void 0;
      }
    }
  ]