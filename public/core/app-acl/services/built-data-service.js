'use strict';
module.exports = [
  '$q',
  '$http',
  function($q, $http) {
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
        typePrefix : "/classes",
        getAll : function(args){
          var apiUrl = '/' + [args.options.classUid, 'objects'].join('/');
          return $http.get(host+this.typePrefix+apiUrl, {
            headers: headers,
            params: args.options.query
          }).then(wrapper())
        },
        postGetAll : function(args){
          console.log("args.options.query.query",args.options.query)
          var apiUrl = '/' + [args.options.classUid, 'objects'].join('/');
          args.options.query['_method'] = 'GET';
          return $http.post(host+this.typePrefix+apiUrl, args.options.query, {
            headers: headers,
            data: args.options.query
          }).then(wrapper())
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