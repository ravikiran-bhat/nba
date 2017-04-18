'use strict';
var addButton = require('../partials/add-button.html');
module.exports = ['relayService',function(Relay) {
    return {
      template: addButton,
      restrict: 'A',
      replace: true,
      link: function(scope, elem, attrs) {
        scope.addEntity = function(){
          Relay.send('add-entity');
        }
      }
    }
}]