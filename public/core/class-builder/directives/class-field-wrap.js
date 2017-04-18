'use strict';

var listBuilderTemplate = require('../partials/class-field-wrap.html');

module.exports = [
  '$compile',
  function($compile) {
    return {
      replace: true,
      restrict: 'A',
      scope: {
        clssdata      : '=clssdata',
        grplevelcount : '=grplevelcount',
        allclss       : '=allclss',
        dtypes        : '=dtypes',
        clss          : '=clss',
        isEdit        : '=isEdit',
        parentUid     : '=parentUid',
        parentField   : '=parentField',
        isGroupMultiple:'=isGroupMultiple'
        // knowledgeBase : '=knowledgeBase'
      },
      link: function(scope, elem, attrs) {
        var $template = angular.element(listBuilderTemplate);
        $compile($template)(scope);
        elem.append($template);
        scope.sortableOptions = {
          forcePlaceholderSize: true,
          axis: "y",
          handle: '.cf-handle i',
          opacity: 1,
          placeholder: "ui-sortable-placeholder",
          scroll: "true",
          containment: "parent"
        };
      }
    }
  }
]