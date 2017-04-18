/***
  *@name Previous state 
  *@type Service
  *@desc This service is use to maintain the previous route in its sub-state. 
  *@example In case of pagination, once an item on page 3 is edited, it should be redirected to first page
  and not the same page.
***/
'use strict';
module.exports = [
  '$state',
  '$q',
  function($state, $q) {
    var previousStateName = "";
    var previousParams = "";

    this.go = function(fallbackStateName, fallbackParams) {
      console.log("previousStateName", previousStateName);
      if (!_.isEmpty(previousStateName)) {
        window.history.go(-1);
        return $q.when();
      }

      console.log("running state.go", fallbackStateName, fallbackParams);
      return $state.go(fallbackStateName, fallbackParams);
    }

    this.set = function(stateName, params) {
      previousStateName = stateName;
      previousParams = params;
    }
  }
]