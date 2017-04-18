'use strict';
var formFieldIsodateTemplate = require('../../partials/form-field-link.html');

module.exports = function() {
  return {
    template: formFieldIsodateTemplate,
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
  
      scope.$watchCollection('ctx[prop]', function(){
        var setLinkToUndefined = (prevValue===undefined  || (prevValue && Object.keys(prevValue).length === 0)) && 
        scope.ctx[scope.prop] && ( (scope.ctx[scope.prop].title === '' && scope.ctx[scope.prop].href === '') || (!scope.ctx[scope.prop].title && scope.ctx[scope.prop].href === '') || (scope.ctx[scope.prop].title === '' && !scope.ctx[scope.prop].href) )
        if(setLinkToUndefined){
          scope.ctx[scope.prop] = undefined
        }
      })
    }
  }
}