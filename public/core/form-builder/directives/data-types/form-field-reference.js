'use strict';
var formFieldRef = require('../../partials/form-field-reference.html')

module.exports = [
  '$q',
  'referenceObjectsSuggestionService',
  'constants',
  function($q, suggestionService, constants) {
    return {
      template: formFieldRef,
      restrict: 'A',
      replace: false,
      scope: {
        field: '=field',
        obj: '=obj',
        ctx: '=ctx',
        prop: '=prop',
        apikey: '=apikey',
        refDatum: '=',
        onAdd: '=onAdd',
        onRemove: '=onRemove',
        klass: '=klass',
        loadingDone: '=',
        viewonly:'='
      },

      link: function(scope, elem, attrs) {

        var referenceSelector = elem.find('#js-select-reference');
        var cacheOrNetwork;
        cacheOrNetwork = function(query, klass) {
          if (klass && !_.isEmpty(query.term.trim())) {
            return suggestionService.get(scope.apikey, scope.field.reference_to, query, klass)
              .then(function(data) {
                var more = (query.page * constants.queryLimit) < data.count
                return {
                  results: data.objects,
                  more : more
                };
              });
          } else {
            // Return an empty result to select2 {results: []} when class not found.
            return $q.when({
              //handles single reference value
              results: !!scope.field.multiple ? [] : ""
            });
          }
         }
         
        var searchRef = _.throttle(function(query, klass) {
          var searchResults = cacheOrNetwork(query, klass);
          return searchResults;
        }, 1000);

        scope.$watch('loadingDone', function() {
          if (!scope.loadingDone){
            elem.find("input:text").select2('val', ["Loading..."]);
            return;
          }
          console.log("scope.field.multiple",scope.field.multiple)
          var select2Data = {
            minimumInputLength: 1,
            multiple: true,
            closeOnSelect: false,
            maximumSelectionSize: 1,
            query: function(query) {
              var RefVariable = searchRef(query, scope.klass);
              if (RefVariable)
                return RefVariable.then(query.callback);
            }
          }
          if(scope.field.multiple)
            delete select2Data.maximumSelectionSize
          referenceSelector.select2(select2Data);

          referenceSelector.select2('data', scope.refDatum);
          referenceSelector.select2('enable', !scope.viewonly);
        })

        scope.$watch('refDatum', function(newVal, oldVal){
          //if(!_.isEmpty(newVal)){
            referenceSelector.select2('data', scope.refDatum);
          //}
        });

        referenceSelector.on('change', function(e) {
          //handles single reference value
          scope.ctx[scope.field.uid] = !!scope.field.multiple ? e.val : (e.val[0] ? e.val[0] : "");
          if(_.isEmpty(e.val)){
          //handles single reference value
           scope.refDatum = !!scope.field.multiple ? [] : ""; 
          }
        });
      }
    }
  }
]