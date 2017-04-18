'use strict';
var formFieldRefWrapTemplate = require('../../partials/form-field-ui-reference-wrap.html')

module.exports = [
    'uiReferenceObjectsSuggestionService',
    function(suggestionService) {
      return {
        template: formFieldRefWrapTemplate,
        restrict: 'A',
        scope: {
          field: '=field',
          obj: '=obj',
          ctx: '=ctx',
          apikey: '=apikey',
          viewonly: '=viewonly',
          classes:'=?'          
        },
        link: function(scope, elem, attrs) {
          
          if(!_.isEmpty(scope.field))
            if (scope.field.uid.indexOf('.') != -1) {
              var fieldUidArr = scope.field.uid.split('.');
              scope.field.uid = fieldUidArr[fieldUidArr.length - 1].trim();
            }

          if (!_.isEmpty(scope.ctx[scope.field.uid])) {
            scope.referencedata = suggestionService.construct(scope.ctx[scope.field.uid]);
          }
        }
      }
    }
  ]
