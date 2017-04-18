'use strict';
module.exports = [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      scope:{
        focusOnInput:'=?'
      },
      link: function(scope, elem, attrs) {
        var options = {};

        //$timeout required for execution at end ie after all the directives render
        $timeout(function(){
          options = _.assign(options, scope.focusOnInput);
          if(options.setNoFocus)
            return;
         
          //$timeout required in case of modal
          $timeout(function(){
            if(options.multiline && elem.find('textarea').length){
              $(elem.find('textarea'))[0].focus();
              return;  
            }

            if($(elem).is(':input'))
                elem.focus();
              else
                $(elem.find('input').not(':disabled'))[0].focus();
          }, 100)
        }, 0);
      }
    }
}]