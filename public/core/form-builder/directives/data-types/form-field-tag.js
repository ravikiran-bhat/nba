'use strict';
var formFieldTagTemplate = require('../../partials/form-field-tag.html');
require('third-party-modules/select2');
module.exports = ['$compile',
  function(compile) {
    return {
      template: formFieldTagTemplate,
      restrict: 'A',
      replace: false,
      scope: {
        field: '=field',
        obj: '=obj',
        ctx: '=ctx',
        prop: '=prop'
      },
      link: function(scope, elem, attrs) {
        var tagsArray = [];
        if (scope.obj.hasOwnProperty('tags')) {
          if (scope.obj.tags.length > 0) {
            tagsArray = scope.obj.tags.map(function(tag) {
              return {
                id: tag,
                text: tag
              }
            })
          }
        }

        console.log("elem", elem);
        elem.select2({
          'multiple': true,
          tags: tagsArray,
          tokenSeparators: [',']
        });

        elem.select2('data', tagsArray)
        elem.on('change', function(e) {
          if (elem.select2('data').length > 0) {
            scope.obj.tags = elem.select2('data').map(function(tag) {
              return tag.text;
            })
            console.log("cvcvcvc", elem.select2('data'), scope.obj.tags)
          }else{
            scope.obj.tags = []
          }
        })
      }
    }
  }
]