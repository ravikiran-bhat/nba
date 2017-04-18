'use strict';
module.exports = [
  '$compile',
  function(compile) {
    return {
      template: "",
      restrict: 'A',
      replace: false,
      scope: {
        field: '=field',
        obj: '=obj',
        ctx: '=ctx',
        prop: '=prop',
        viewonly: "=viewonly"
      },
      link: function(scope, elem, attrs) {
         elem.val(scope.ctx[scope.prop]).select2({
          data: scope.field.field_metadata.__blt_data.__blt_select
        })
         .on('change', function(e){
          scope.ctx[scope.prop] = e.val;
         });
      }
    }
  }
]