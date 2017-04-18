'use strict';
var formFieldMixedTemplate = require('../../partials/form-field-mixed.html');

module.exports = function() {
  return {
    template: formFieldMixedTemplate,
    restrict: 'A',
    replace: true,
    scope: {
      field: '=field',
      obj: '=obj',
      ctx: '=ctx',
      prop: '=prop'
    },
    link: function(scope, elem, attrs) {
      scope.mmixed = JSON.stringify(scope.ctx[scope.prop], null, 2);
      scope.$watch('mmixed', function(newVal, oldVal) {
        try {
          scope.ctx[scope.prop] = JSON.parse(newVal);
        } catch (e) {
          scope.ctx[scope.prop] = newVal;
        }
      })
      /*var prevValue = _.cloneDeep(scope.ctx[scope.prop])
      scope.mmixed = JSON.stringify(scope.ctx[scope.prop], null, 2);
      scope.$watch('mmixed', function(newVal, oldVal) {
        try {
          scope.ctx[scope.prop] = JSON.parse(newVal);
        } catch (e) {
          scope.ctx[scope.prop] = newVal;
        }
        if(prevValue===undefined && scope.ctx[scope.prop]==="")
          scope.ctx[scope.prop] = undefined;
      })*/
    }
  }
}