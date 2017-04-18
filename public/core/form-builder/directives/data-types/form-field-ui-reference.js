'use strict';
var formFieldRef = require('../../partials/form-field-reference.html');

module.exports = [
  'uiReferenceObjectsSuggestionService',
  'appCacheService',
  function(suggestionService, appCacheService) {
    return {
      template: formFieldRef,
      restrict: 'A',
      replace: false,
      scope: {
        referencedata: '=referencedata',
        field: '=field',
        apikey: '=apikey',
        ctx: '=ctx',
        classes:'=?'
      },

      link: function(scope, elem, attrs) {
        var searchRef = _.throttle(function(query) {
          return suggestionService.get(scope.apikey, scope.field, query, scope.classes)
            .then(function(data) {
              return {
                results: data
              };
            });
        }, 1000);

        //Set Reference Data Value
        scope.$watch('referencedata', function(oldVal, newVal) {
          elem.select2('data', scope.referencedata)
        });

        if(!_.isEmpty(scope.field)){
          //Initializing Select2 with its options
          elem.select2({
            minimumInputLength: 1,
            multiple: true,
            query: function(query) {
              if (searchRef(query.term))
                searchRef(query.term).then(query.callback);
            },
            escapeMarkup: function(m) {
              return m;
            }
          });
        }else{
          elem.select2({
            placeholder:"Enter data",
            tags :[]
          })
        }

        //changing data on Select
        elem.on('change', function(e) {
          if (e.val) {
            scope.ctx[scope.field.uid] = e.val;
          }
        });



      }
    }
  }
]