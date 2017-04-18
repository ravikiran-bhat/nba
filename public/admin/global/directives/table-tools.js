'use strict';
var ttTmpl = require('./partials/table-tools.html')

module.exports = [
  'utilsService',
  'alertService',
  '$timeout',
  function(Utils, Alert, $timeout) {
    return {
      template: ttTmpl,
      restrict: 'A',
      replace: true,
      scope: {
        ttData: "=",
        sortByData: "=",
        count: "="
      },
      link: function(scope, elem, attrs) {
        var sortBySelect = $(elem).find('.js-sort-by-select');
        scope.pages = []
        scope.pageNo = scope.ttData.pageNo || 1

        scope.$watch('count', function(newVal, oldVal){
          if(!newVal.total)
            return;
          if(newVal.total !== oldVal.total){
            createPages(newVal.total)
          }
          checkButtons();
        }, true);

        scope.$watch('pageNo', function(newVal, oldVal){
          if(newVal !== oldVal){
            scope.ttData.skip = scope.ttData.limit * (newVal-1);  
            scope.ttData.pageNo = newVal;
          }
        });

        scope.$watch('ttData.pageNo', function(newVal, oldVal){
          if(newVal !== oldVal){
            scope.pageNo = newVal;
          }
        });

        scope.prev = function() {
          console.log("Toggling previous")
          var skipNum = scope.ttData.skip - scope.ttData.limit;
          if(skipNum < 0){
            scope.ttData.skip = 0;
            scope.ttData.pageNo = 1;
          } else{
            scope.ttData.skip = skipNum;
            scope.ttData.pageNo--;
          }
          scope.pageNo = scope.ttData.pageNo
          checkButtons()
        }

        scope.next = function() {
          console.log("Toggling next")
          var skipNum = scope.ttData.skip + scope.ttData.limit;

          if(skipNum < scope.count.total){
            scope.ttData.skip = skipNum;  
            scope.ttData.pageNo++;
          }
          scope.pageNo = scope.ttData.pageNo
          checkButtons();
        }

        scope.toggleOrder = function(order) {
          console.log("Toggling order")
          scope.ttData.order = order;
        }

        function formatClassResult(state) {
          return "<small class='text-muted'> Sort by: </small>" + state.text;
        }

        function checkButtons() {
          scope.canGoBack = scope.ttData.skip === 0 ? false : true;
          scope.canGoForward = Math.ceil(scope.count.total/scope.ttData.limit) === scope.ttData.pageNo ? false : true;
          console.log("Can go back: ", scope.canGoBack)
          console.log("Can go forward: ", scope.canGoForward)
        }
        function createPages(totalItems){
          scope.pages = []
          for(var i=1; i <= Math.ceil(totalItems/scope.ttData.limit); i++){
            scope.pages.push(i);
          }
        }
      }
    }
  }
]