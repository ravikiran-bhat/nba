'use strict';
module.exports = [
  '$q',
  '$http',
  'builtApi',
  function($q, $http, builtApi) {
    var prefix  = "";
    var self    = this;
    var headers = {};
    var host    = "";
      self.Header = {
        set : function(args){
          if(!_.isEmpty(args.application_api_key)){
            prefix  = args.prefix;
            host    = args.apihost+prefix;
            headers = args;
          }
        },
        get : function(){
          return headers;
        }
      };

      self.Objects = {
        getAll : function(args){
          return builtApi.Objects.getAll(args)
        } 
      };
  }
]