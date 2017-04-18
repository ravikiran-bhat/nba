module.exports = [
  'builtApi',
	'appCacheService',
  '$scope',
  '$location',
  '$state',
  '$timeout',
  '$rootScope',
  'relayService',
  'utilsService',
  'UIConfig',
  '$injector',
  'libraryService',
  function(builtApi, appCacheService,$scope, $location, $state, $timeout, $rootScope,Relay,Utils, UIConfig, $injector, LIB) {
    $scope.year = new Date().getFullYear();

    $scope.showAllApps = function() {
     $state.go('app.applications.listboard');
    }

    $scope.logout = function() {
      /**
        Removing current user from cache to prevent caching of currentUser on signin page.
      **/
      builtApi.UserSession.logout()
        .then(function(user) {
          appCacheService.remove('currentUser');
          $rootScope.loggedIn = false;
          $timeout(function(){
            $state.go('app.auth.signin');
            $location.search({});
          }, 0);
        }, function(error) {});
    };

    function getUserFromAppCache(){
      return _.cloneDeep(appCacheService.get('currentUser'))
    }
    // Get Current User
    function getCurrentUser() {
      var user = getUserFromAppCache();
      $scope.userName = null;
      $timeout(function() {
        if (user) {          
          user.first_name = user.first_name ? user.first_name.trim() : '';
          user.last_name  = user.last_name ?  user.last_name.trim() : '';
          $scope.userName = (user.first_name || user.last_name) ? user.first_name + " " + user.last_name : user.email;
        } else {
          $scope.userName = null;
        }
      });
    }

    Relay.onRecieve('currentUser', function(event, args) {
      Utils.sa($scope, function(){
        getCurrentUser();
      });
    });

    function setEventOnUserRefresh(){
      var appCacheUserData = getUserFromAppCache();
      if(appCacheUserData){
        delete appCacheUserData.authtoken;
      }
    }

    getCurrentUser();
    setEventOnUserRefresh();

    var goForMap = false;

    function getMap() {
      if (!UIConfig.features.maps.enabled || goForMap) return;
      var key = "";
      if (UIConfig.features.maps.meta.api_key)
        key = "?key=" + UIConfig.features.maps.meta.api_key;

      $injector.invoke(['thirdPartyService',
        function(TPS) {
          TPS.getMap(key).then(function(MapStatus) {
            console.log("MapStatus",MapStatus);
            goForMap = MapStatus;
            LIB.register('googleMaps');
          });
        }
      ]);
    }
    $rootScope.$on('$stateChangeStart', function(event, toState){
      if(toState.controller == 'signinCtrl' && $rootScope.loggedIn == true){
        event.preventDefault();
        $state.transitionTo('app.applications.listboard');
      }
    })
    getMap();
  }
]