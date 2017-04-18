'use strict';
 var formFieldRefWrapTemplate = require('../../partials/form-field-reference-wrap.html');

  module.exports = [
    'referenceObjectsSuggestionService',
    'fbBuiltDataService',
    '$cacheFactory',
    function(suggestionService, builtApi, $cacheFactory) {
      return {
        template: formFieldRefWrapTemplate,
        restrict: 'A',
        replace: true,
        scope: {
          field: '=field',
          obj: '=obj',
          ctx: '=ctx',
          apikey: '=apikey',
          onAdd: '=onAdd',
          onRemove: '=onRemove',
          viewonly: '=viewonly'
        },
        link: function(scope, elem, attrs) {
          scope.loadingDone = false;
          var result;
          //handles single reference value
          function handleSingleRef(ref){
            if(typeof ref === 'string')
              return [ref]
            return ref
          }
          //handles single reference value
          result = scope.ctx[scope.field.uid] ? handleSingleRef(scope.ctx[scope.field.uid]).map(function(uid) {
            return suggestionService.construct(uid, uid);
          }) : (!!scope.field.multiple ? [] : "")
          //scope.refData = !!scope.field.multiple ? result : (result.length?result[0]:"")
          scope.refData = result

          /*scope.refData = scope.ctx[scope.field.uid] ? scope.ctx[scope.field.uid].map(function(uid) {
            return suggestionService.construct(uid, uid);
          }) : []
*/
          
          builtApi.Classes.getOne({
            options: {
              classUid: scope.field.reference_to
            }
          }).then(function(klass) {
            scope.klass = klass;

            // Don't make a call to fetch objects if no reference objects are selected.
            if (!scope.ctx[scope.field.uid] || (scope.ctx[scope.field.uid] && !scope.ctx[scope.field.uid].length)) {
              scope.loadingDone = true;
              return;
            }

            suggestionService.get(scope.apikey, scope.field.reference_to, {term : scope.ctx[scope.field.uid]}, klass)
              .then(function(rData) {
                scope.refData = rData.objects;
              })
              .finally(function() {
                scope.loadingDone = true;
              })
          }, function(xhr) {
            scope.loadingDone = true;
          })

          // we watch for any changes in the underlying data structure.
          // then we change our own model of the data accordingly.
          scope.$watchCollection('ctx[field.uid]', function(oldVal, newVal) {
            if(oldVal != newVal){
              if (!_.isEmpty(scope.ctx[scope.field.uid])) {
                result = handleSingleRef(scope.ctx[scope.field.uid]).map(function(uid) {
                  return R.find(R.where({
                    id: uid
                  }), suggestionService.getCache());
                });
                //scope.refData = !!scope.field.multiple ? result : (result.length?result[0]:"")
                scope.refData = result ? result : (!!scope.field.multiple ? [] : "")
              }else{
                scope.refData = !!scope.field.multiple ? [] : "";
              }
              return;
            }else{
              var cache = scope.refData;
             // console.log("watchcollection equal", scope.refData);
              if (!_.isEmpty(scope.ctx[scope.field.uid])) {
                result = handleSingleRef(scope.ctx[scope.field.uid]).map(function(uid) {
                  return R.find(R.where({
                    id: uid
                  }), scope.refData) || suggestionService.construct(uid, uid);
                });
                scope.refData = result ? result : (!!scope.field.multiple ? [] : "")
              }
            }
          });
        }
      }
    }
  ]