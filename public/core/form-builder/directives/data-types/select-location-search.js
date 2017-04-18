'use strict';
module.exports = function() {
  return {
    template: "<div></div>",
    restrict: 'A',
    replace: false,
    scope: {
      searchReference: '=',
      onSelectedReference: '='
    },
    link: function(scope, elem, attrs) {
      
      elem.select2({
        minimumInputLength: 1,
        containerCssClass: 'no-arrow',
        placeholder: "Type in an address, place or street name...",
        query: function(query) {
          if (scope.searchReference(query.term))
            scope.searchReference(query.term).then(query.callback);
        }
      });

      elem.on('change', function(e) {
        if (elem.select2('data'))
          scope.onSelectedReference(elem.select2('data'))
      });
    }
  }
}