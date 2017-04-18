'use strict';
var optActemplate = require('../partials/optional-actions.html');
module.exports = ['relayService',function(Relay) {
    return {
      template: optActemplate,
      restrict: 'A',
      replace: true,
      transclude: true,
      link: function(scope, elem, attrs, ctrl, trnsclude) {
        var trancludeSelector = elem.find('#js-transclude');
        trnsclude(function(clone){
          if (clone.length){
              trancludeSelector.replaceWith(clone);
          }
          else {
              trancludeSelector.remove();
          }
        })
      }
    }
}]