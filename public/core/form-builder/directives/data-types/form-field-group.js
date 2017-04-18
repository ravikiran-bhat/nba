'use strict';
var formFieldGroupTemplate = require('../../partials/form-field-group.html');

module.exports = [
  '$compile',
  'utilsService',
  function($compile, Utils) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        field     : '=field',
        obj       : '=obj',
        ctx       : '=ctx',
        prop      : '=prop',
        apikey    : '=',
        apihost   : '=apihost',
        viewonly  : '=viewonly',
        classes   : '=?',
        authtoken : "=authtoken",
        tenant    : "=tenant"
      },
      link: function(scope, elem, attrs) {
        var $template = angular.element(formFieldGroupTemplate);
        $compile($template)(scope);
        elem.append($template);
        var groupWrap = $(elem).find('.group-wrap').eq(0);
        if (scope.field.multiple) {
          groupWrap.attr('id', 'grp-multiple-' + Utils.getRand());
        }

        scope.toggleGroup = function(){
          groupWrap.toggleClass('collapsed');
        }
      }
    }
  }
]