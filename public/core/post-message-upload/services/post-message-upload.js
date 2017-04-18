'use strict';
var defers = {};
module.exports = [
  '$q',
  '$rootScope',
  function($q, $rootScope) {
    var cleanUp = function(delimiter) {
      delete defers[delimiter];
    };

    this.getPostMessage = function(d) {
      var deferred = $q.defer();
      defers[d] = deferred;
      return defers[d].promise;
    }

    if ($rootScope.postMsgAttached) return;

    $rootScope.postMsgAttached = true;

    $(window).on('message', function(res) {
      //Check was done regarding Browserify adding a 'process-tick' to window on message event.
      if (res.originalEvent.data != "process-tick") {
        var dataObj = JSON.parse(res.originalEvent.data);
        if (defers[dataObj.postmessage_payload]) {
          defers[dataObj.postmessage_payload].resolve(dataObj);
          cleanUp(dataObj.postmessage_payload);
        }
      }
    });

  }
]