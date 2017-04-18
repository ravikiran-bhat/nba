var ribbonBuilderTmpl = require('../partials/ribbon-builder.html');

module.exports = [
  'relayService',
  '$state',
  '$rootScope',
  'can',
  '$timeout',
  'utilsService',
  function(Relay, $state, $rootScope, CAN, $timeout, Utils) {
    return {
      restrict: 'A',
      template: ribbonBuilderTmpl,
      link: function(scope, elem, attrs) {
        scope.activeFilter  = 'All applications';
        scope.mobileView    = true;
        scope.search        = {
          text : ""
        }
        Relay.onInbuildEvent('$stateChangeSuccess', function(){
          initRibbonComponents();
        });

        scope.toggleFilter = function(option){
          scope.activeFilter = option;
          Relay.send('applications.filterBy', option);
        }

        function initRibbonComponents(){
          scope.appListboard  = $state.is("app.applications.listboard");
          scope.appDashboard  = $state.includes("app.applications.dashboard");
          scope.deviceVisible = 'phone, tablets';
          scope.search.text   = $state.params.search || "";
          setVisibility();
        }initRibbonComponents();        


        function setVisibility(){
          scope.ribbon = $state.current.data.ribbon || {};
          if(~$state.current.name.indexOf('classes-user-list')){
            scope.ribbon.addEntityVisible = CAN.classes.create;
          }

          //For other modules with no search box the breadcrumbs shall always be visible
          if(!scope.ribbon.searchBoxVisible)
            scope.deviceVisible = false;
        }
      }
    }
  }
]
