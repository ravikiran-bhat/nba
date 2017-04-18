'use strict';
module.exports = [
  '$q',
  '$http',
  function($q, $http) {
    var self      = this;
    var headers   = {};
    var host      = "";
    var prefix    = "";
      self.Header = {
        set : function(args){
          if(!_.isEmpty(args.application_api_key)){
            host    = args.apihost;
            headers = args; 
            prefix  = args.prefix;
          }
        },
        get : function(){
          return headers;
        }
      };
      
      self.Classes = {
        typePrefix : "/classes",
        getOne : function(args){
          console.log("it came twice", host+prefix+this.typePrefix+'/'+args.options.classUid);
          return $http.get(host+prefix+this.typePrefix+'/'+args.options.classUid, {
            headers: headers,
          }).then(wrapper('class'))
        } 
      };

      function wrapper(wrap){
        if (typeof(wrap) != "undefined") {
          return function(res) {
            return res.data[wrap];
          }
        } else {
          return function(res) {
            return res.data;
          }
        }
      }
  }
]