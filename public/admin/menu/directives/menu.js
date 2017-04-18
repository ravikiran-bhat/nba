'use strict';
var metricsWidget = require('./partials/menu.html')

module.exports = [
  '$state',
  'menuService',
  'appCacheService',
  'manageUtils',
  '$timeout',
  'relayService',
  '$compile',
  function($state, menu, appCacheService, manageUtils, $timeout, Relay, $compile) {
    return {
      template: metricsWidget,
      restrict: 'A',
      replace: true,
      scope:{
        currentApp    :'=',
        isowner       :'='
      },
      link: {
        post : function(scope, elem, attrs) {
          scope.onSetCurrentApp  = false;
          scope.menu             = menu.getMenu(scope.currentApp.api_restriction);
         
          scope.isActiveMenu = function(s) {
            //console.log("is active menu", s);
            if (s.sub_menu){
              return false;
            }
            return $state.is(s.state);

          }

          scope.checkIfParent = function(menu) {
            return menu.hasOwnProperty('sub_menu');
          }
        
          scope.toggleMenu = function(e, menu) {
            elem.find('nav > li').removeClass('active');
            if (menu.sub_menu) {
              e.stopPropagation();
              return false;
            }
          }

          function bindClicks() {
            $('#left-panel .js-menu-link').off('click').on('click', function(e) {
              var menuItem = $(e.currentTarget).data('menu-item');
              
              // if(!menuItem.sub_menu){
              //   elem.find('nav li').removeClass('open');
              //   elem.find('nav > ul ul').hide();
              // }

              var isPermitted = manageUtils.applications.checkRestriction(menuItem['restrict'], scope.isShared);
              
              // Hide menu on link click on tablet and small screen devices.
              if(isPermitted && window.innerWidth < 980)
                initApp.toggleMenu(); 

              return isPermitted;
            });
          }

          function initScope(){
              scope.onSetCurrentApp = true;
              scope.menu    = menu.getMenu(scope.currentApp.api_restriction);
              //console.log("menu -->", scope.menu);
              scope.tenant  = "";
              scope.stateQueryParam  = {
                api_key: scope.currentApp.api_key,
                p: 1
              };
          }

          scope.$watch('currentApp', function(){
            if(!_.isEmpty(scope.currentApp)){
              initScope();  
            }else{
              scope.onSetCurrentApp = false;
            }
          });
          
          $timeout(function() {
            //On refresh
            bindClicks();
            initApp.leftNav();
          }, 0);
        },
        pre : function(){
          //initApp.leftNav();
          
        }  
      }
    }
  }
]