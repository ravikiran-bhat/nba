'use strict';
var formFieldPasswordTemplate = require('../../partials/form-field-password.html');

module.exports = function() {
  return {
    template: formFieldPasswordTemplate,
    restrict: 'A',
    replace: true,
    scope: {
      field: '=field',
      obj: '=obj',
      ctx: '=ctx',
      prop: '=prop'
    },
    link: function(scope, elem, attrs) {
    }
  }
}