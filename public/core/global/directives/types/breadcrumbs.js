'use strict';

var breadcrumbsTpl = require('../partials/breadcrumbs.html');
module.exports = [
  '$rootScope',
  '$state',
  'utilsService',
  '$timeout',
  '$injector',
  function($rootScope, $state, Utils, $timeout, $injector) {
    return {
      template: breadcrumbsTpl,
      restrict: 'A',
      replace: true,
      scope: {},
      link: function(scope, elem, attrs) {
        scope.breadcrumbs = [];
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
          $timeout(function() {
            Utils.sa(scope, function() {
              updateBreadcrumbs($state);
            });
          }, 0);
        });

        updateBreadcrumbs($state);

        function updateBreadcrumbs(currentState) {
          if (!Utils.getPath(currentState, '$current.data.breadcrumbs')) {
            scope.breadcrumbs.length = 0;
            return;
          }

          // check breadcrumb data for any interpolation. 
          // Also the breadcrumbs are cloned to remove reference from the current state.
          scope.breadcrumbs = _.map(_.cloneDeep(currentState.$current.data.breadcrumbs), function(crumb) {
            crumb.name = interpolateName(crumb.name, currentState);
            if (typeof crumb.state =="function"){
              crumb.state = crumb.state($state);
            }
            if (crumb.params){
              crumb.params.p = 1;
              crumb.params = interpolateStateParams(crumb.params, currentState);
            }
            return crumb;
          });
        }

        function interpolateStateParams(params, state) {
          for (var key in params) {
            params[key] = interpolateName(params[key], state);
          }
          return params;
        }

        function interpolateName(name, state) {
          if (!_.contains(name, '{{'))
            return name;

          return Utils.getPath(state, '$current.locals.globals.' + name.replace(/[{}]/g, '')) || name;
        }
      }
    }
  }
]