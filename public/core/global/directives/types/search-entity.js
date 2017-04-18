var appSearchBoxTPL = require('../partials/search-entity.html');

module.exports = [
  'utilsService',
  '$state',
  'relayService',
  function(Utils, $state, Relay) {
    return {
      restrict: 'A',
      replace: true,
      template: appSearchBoxTPL,
      scope:{
        search : "="
      },
      link: function(scope, elem, attrs) {
        
        var onSearchApp = _.debounce(function(text){
          Relay.send('search-entity', text);
        }, 500);

        function checkForKeyCodes(code){
          return ((code >=48 && code<=90) || (code >=96 && code<=111) || (code >=186 && code<=222) || code===8 || code === 46)
        }

        scope.searchApp = function(e){          
          if(checkForKeyCodes(e.which)){
            onSearchApp(e.target.value);              
          }
        };

        /* For chrome in Android browsers */
        var ua        = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1;
        var isIOS     = ua.indexOf("/iPhone|iPad/i")

        scope.onChangeSearch = function(text) {
          if(isAndroid || isIOS) {
            onSearchApp(text);
          }
        }
      }
    }
  }
]
