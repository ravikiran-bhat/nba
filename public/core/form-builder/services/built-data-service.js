'use strict';
/*var config = require('../config/config.json')*/
module.exports = [
  '$q',
  '$http',
  function($q, $http) {
    var self    = this;
    var headers = {};
    var host    = "";
    var prefix  = "";
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

      self.File = {
        typePrefix : "/uploads",
        getUpload : function(args){
          var urlType = args.options.uploadType ? '/'+args.options.uploadType : args.options.uploadType;
          return $http.get(host+this.typePrefix+urlType, {
            params : args.options.query || {},
            headers: headers,
          }).then(wrapper())

        }
      };
      
      self.Classes = {
        typePrefix : "/classes",
        getOne : function(args){
          console.log("it came twice", args);
          return $http.get(host+this.typePrefix+'/'+args.options.classUid, {
            headers: headers,
          }).then(wrapper('class'))
        } 
      };

      self.Objects = {
        typePrefix : "/classes",
        getAll : function(args){
          var apiUrl = '/' + [args.options.classUid, 'objects'].join('/');
          return $http.get(host+this.typePrefix+apiUrl, {
            headers: headers,
          }).then(wrapper())
        },
        postGetAll : function(args){
          var apiUrl = '/' + [args.options.classUid, 'objects'].join('/');
          args.options.query['_method'] = 'GET';
          return $http.post(host+this.typePrefix+apiUrl, args.options.query, {
            headers: headers,
            data: args.body
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