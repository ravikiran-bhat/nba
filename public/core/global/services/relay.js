module.exports = ['$rootScope',
  function($rootScope) {

    var eventList = [];
    //extend Angular's scope allowing you to remove listeners
    this.extendRootScope = function() {
      $rootScope.constructor.prototype.$off = function(eventName) {
        if(this.$$listeners) {
          var eventArr = this.$$listeners[eventName];
          if(eventArr) {
            // for(var i = 0; i < eventArr.length; i++) {
            //   if(eventArr[i] === fn) {
            //     eventArr.splice(i, 1);
            //   }
            // }
            this.$$listeners[eventName] = [];
          }
        }
      }
    }

    this.onRecieve = function(key, callback) {
      $rootScope.$off(key);
      $rootScope.$on(key, callback);
    }

    this.onInbuildEvent = function(key, callback) {
      $rootScope.$on(key, callback);
    }

    this.send = function(key, data) {
      //console.log("$rootScope.$$listeners[key]", $rootScope.$$listeners[key], key, $rootScope.$$listeners);
      if($rootScope.$$listeners[key]){
        eventList.push(key);
        $rootScope.$emit(key, data);
      }
      //console.log("$rootScope.$$listeners", $rootScope.$$listeners)
    }

    this.clearEventListener = function(){
      eventList.forEach(function(key){
        $rootScope.$off(key);
      })
    }
  }
]