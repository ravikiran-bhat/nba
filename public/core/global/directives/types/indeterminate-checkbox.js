'use strict';
var indeterminateCheckbox = require('../partials/indeterminate-checkbox.html');
module.exports = ['relayService','$timeout',function(Relay, $timeout) {
    return {
      template: indeterminateCheckbox,
      restrict: 'A',
      replace: true,
      scope:{
        value: '=indeterminateCheckbox',
        className: '=className'
      },
      link: function(scope, elem, attrs) {
        function setPropsAndData(elem,dataChecked,propChecked,indeterminate){
          elem.prop('indeterminate',indeterminate);
          elem.prop('checked',propChecked);
          elem.data('checked',dataChecked);
        }
        $timeout(function(){
          var elem = $("."+scope.className), el;
          intiateCheckbox(scope.value, elem);
          elem
           .click(function(e) {
              el = $(this);
              switch(el.data('checked')) {
                // unchecked, going indeterminate
                case 0:
                  setPropsAndData(el, 1,undefined, true)
                  el.addClass('indeterminate-checkbox')
                  scope.value = undefined;
                  break;
                // indeterminate, going checked
                case 1: 
                  setPropsAndData(el, 2, true, false)    
                  el.removeClass('indeterminate-checkbox')
                  scope.value = true;
                  break;
                
                // checked, going unchecked
                default:  
                  setPropsAndData(el, 0, false, false)
                  el.removeClass('indeterminate-checkbox')
                  scope.value = false;
              }
            });
          function intiateCheckbox(value, elem){
            switch(value){
              case true:
                setPropsAndData(elem, 2, true, false)
                break;
              case false:
                setPropsAndData(elem, 0, false, false)
                break;
              case undefined:
                setPropsAndData(elem, 1, undefined, true)
                elem.addClass('indeterminate-checkbox')
                break;
            }
          }
        },10)
      }
    }
}]