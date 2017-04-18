'use strict';
var formFieldTextTemplate = require('../../partials/form-field-text.html');

module.exports = ['$compile',
  function(compile) {
    return {
      template: formFieldTextTemplate,
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
        if(scope.obj.email)
        $('.disable').attr('disabled', true);
        var prevValue = _.cloneDeep(scope.ctx[scope.prop])
        scope.summernoteConfig = {
          toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough']],
            ['Insert', ['link', 'picture', 'table', 'hr']],
            ['Misc', ['fullscreen', 'codeview']],
            ['Layout', ['ul', 'ol', 'paragraph']],
            ['style', ['style']]
          ]
          // ,
          // onImageUpload: function(files, editor, $editable) {
          //   console.log('image upload:', files, editor);
          //   editor.insertImage($editable, url);
          //   console.log('image upload\'s editable:', scope.editable);
          // }
        };

        scope.$watch('ctx[prop]', function(){
          if(prevValue===undefined && scope.ctx[scope.prop] === ""){
            scope.ctx[scope.prop] = undefined
          }
        })
        // scope.$watch('ctx[prop]', function(){
        //   console.log("ctx[prop]", scope.ctx[scope.prop])
        // })
      }
    }
  }
]