'use strict';

module.exports = [
  '$compile',
  'builtApi',
  'utilsService',
  function($compile, builtApi, Utils) {
    return {
      replace: true,
      restrict: 'A',
      scope: {
        referenceto: '=referenceto',
        dataitem: '=dataitem'
      },
      link: function(scope, elem, attrs) {
        
        elem.val(scope.referenceto).select2({
          placeholder: "Select a class",
          minimumInputLength: 1,
          initSelection: function(element, callback) {
            if (!scope.referenceto) {
              callback({
                id: "",
                text: ""
              })
              return;
            }
            builtApi.Classes.getOne({
                options: {
                  classUid: scope.referenceto
                }
              })
              .then(function(klass) {
                callback({
                  id: klass.uid,
                  text: klass.title
                });
              }, function(xhr) {
                onRefNotFound();
                callback({
                  id: "",
                  text: ""
                })
              });
          },
          query: function(query) {
            Utils.getClassSearch(builtApi, query.term)().then(query.callback);
          }
        });

        elem.on('change', function(e) {
          scope.dataitem.reference_to = elem.select2('val');
        })

        function onRefNotFound() {
          Utils.sa(scope, function() {
            scope.dataitem.reference_to = '';
            scope.referenceto = undefined;
            setTimeout(function(){
              elem.select2('val', undefined);
            }, 0);
          })
        }

      }
    }
  }
]