'use strict';
var formFieldNumberTemplate = require('../../partials/form-field-number.html')
module.exports = function() {
  return {
    template: formFieldNumberTemplate,
    restrict: 'A',
    replace: true,
    scope: {
      field: '=field',
      obj: '=obj',
      ctx: '=ctx',
      prop: '=prop'
    },
    link: function(scope, elem, attrs) {
      var prevValue = _.cloneDeep(scope.ctx[scope.prop])
      /*scope.$watch('mnumber', function(newVal, oldVal) {
        //scope.mnumber = newVal;
        scope.ctx[scope.prop] = isNaN(newVal) ? 0 : newVal;
        console.log("isNaN(parsedNumber)", isNaN(scope.mnumber), scope.mnumber, scope.ctx[scope.prop])
      });*/

      scope.$watch("ctx[prop]", function(newVal){
        if(prevValue === undefined && scope.ctx[scope.prop] === 0){
          scope.ctx[scope.prop] = undefined
          return
        }
        scope.ctx[scope.prop] = newVal !== undefined ? isNaN(newVal) || newVal === '' ? 0 : newVal : undefined;
      });
    }
  }
}