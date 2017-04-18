'use strict';
var formFieldBooleanTemplate = require('../../partials/form-field-boolean.html')

module.exports = function() {
  return {
    template: formFieldBooleanTemplate,
    restrict: 'A',
    replace: true,
    scope: {
      field: '=field',
      obj: '=obj',
      ctx: '=ctx',
      prop: '=prop'
    },
    link: function(scope, elem, attrs) {}
  }
}