'use strict';
var formFieldTemplate = require('../../partials/form-field.html');

module.exports = [
  'utilsService',
  '$timeout',
  function(Utils, $timeout) {

    var DEFAULTS = {
      text: function() {
        return undefined
      },
      string: function() {
        return ''
      },
      number: function() {
        return undefined
      },
      reference: function() {
        return ''
      },
      //Ui_reference as a default data type
      ui_reference: function() {
        return ''
      },
      group: function() {
        return {}
      },
      isodate: function() {
        return undefined
      },
      file: function() {
        return null
      },
      boolean: function() {
        return false
      },
      link: function() {
        return undefined
      },
      mixed: function() {
        return {}
      },
      select: function() {
        return ''
      },
      password: function() {
        return '';
      }
    };

    return {
      template: formFieldTemplate,
      restrict: 'A',
      replace: false,
      scope: {
        field     : '=field',
        obj       : '=obj',
        ctx       : '=ctx',
        apikey    : '=apikey',
        authtoken : '=authtoken',
        apihost   : '=apihost',
        viewonly  : '=viewonly',
        classes   : '=?',
        tenant    : '=tenant'
      },

      link: function(scope, elem, attrs) {
        var uid      = scope.field.uid;
        var dataType = scope.field.data_type;
        //DOM
        // Hot fix to find the 1st div in the template.
        var groupOuterWrap = elem.find('> div').eq(0);

        var multiple = scope.field.multiple ?
          'true' : 'false';

        multiple = scope.multiple = (dataType === 'reference') ?
          'reference' : multiple

        if (scope.ctx[uid] === undefined) {
          if ((multiple === 'true') || (dataType === 'reference' && scope.field.multiple === 'true')) {
            scope.ctx[uid] = [];
          } else {
            scope.ctx[uid] = DEFAULTS[dataType]();
          }
        }
        
        scope.sortableOptions = {
          // forcePlaceholderSize: true,
          // axis: "y",
          // handle: '.field-sort-handle',
          // opacity: 1,
          // placeholder: "ui-sortable-placeholder",
          // scroll: "true",
          containment: ".js-as-sortable"
          // start: function(e, ui) {
          //   var el = ui.item.find('> .media > div > .form-field-wrap');
          //   ui.placeholder.height(el.height());
          //   ui.placeholder.width(el.width());
          // },
          // update: function(e, ui) {},
          // stop: function(e, ui) {
          //   scope.$apply(function() {
          //     scope.ctx[scope.field.uid] = _.compact(scope.ctx[scope.field.uid]);
          //   });

          // }
        };

        // $timeout(function() {

        // }, 10);
        // scope.startSort = function($item, $part, $index, $helper){
        //   console.log("$helper", $helper);
          
        //     // var el      = $helper.element.find(".form-field-wrap");
        //     // var placeHolder = $helper.element.find('.ui-sortable-placeholder');
        //     // Utils.sa(scope, function(){
        //     //   placeHolder.css('height', el.height()+'px');
        //     // });
        // }

        scope.onSortField = function(){
          scope.$apply(function() {
            scope.ctx[scope.field.uid] = _.compact(scope.ctx[scope.field.uid]);
          });
        }
      
        scope.onAdd = function() {
          scope.ctx[uid] ? scope.ctx[uid].push(DEFAULTS[dataType]()) : scope.ctx[uid] = [DEFAULTS[dataType]()]
        }


        scope.onRemove = function(index) {
          scope.ctx[uid].splice(index, 1);
        }

        scope.toggleGroup = function() {
          groupOuterWrap.toggleClass('collapsed');
        }

        // assign a random id to the form field-wrap
        if (dataType === 'group')
          groupOuterWrap.attr('id', 'grp-' + Utils.getRand());
      }
    }
  }
]