'use strict';
var appSelectBox = require('../partials/app-select-box.html');
module.exports = [
  'appCacheService',
  'utilsService',
  'relayService',
  '$state',  
  function(appCacheService, Utils, Relay, $state) {
    return {
      template: appSelectBox,
      restrict: 'A',
      replace: true,
      scope: {
        currentApp:"=",
        apps:"=",
        onSelectCallback:"="
      },
      link: function(scope, elem, attrs) {
        scope.searchApplicationText = "";
        setCurrentApp($state.params.api_key);
        scope.openApp = function(api_key) {
          setCurrentApp(api_key);
          Utils.sa(scope, function(){
            scope.onSelectCallback(api_key);
          })
        }

        function setCurrentApp(api_key){
          scope.currentApp = scope.apps.filter(function(app){
            return app.api_key === api_key;
          })[0];
        }

        scope.onToggle = function(){
          scope.searchApplicationText = "";
          setTimeout(function(){
            elem.find('#ribbon-app-search').focus();
          },100);
        }
      }
    }
}]