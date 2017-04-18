'use strict';
module.exports = [
  '$q',
  function($q) {
    var mapRetryCount = 0;
    var deferred = $q.defer();

    this.getMap = function(key) {
      var mapScript = window.location.protocol + '//www.google.com/jsapi' + key;
//      console.log("in get map", mapScript);
      var xmlhttp = $.getScript(mapScript).done(function(script, textStatus) {
        console.log("Google jsapi loaded",script,textStatus);
        google.load("maps", "3", {
          other_params: 'sensor=false&libraries=drawing',
          callback: function() {
            deferred.resolve(true);
          }
        });
      }).fail(function(jqxhr, settings, exception) {
        console.log("Google maps loading failed");
        if (mapRetryCount < 3) {
          console.log("Retrying: " + mapRetryCount);
          this.getMap();
        } else {
          console.log("No Go for map");
        }
        mapRetryCount++;
      });
      return deferred.promise;
    }
  }
]