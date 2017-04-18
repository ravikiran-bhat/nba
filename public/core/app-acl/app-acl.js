'use strict';
var appAclService     = require('./services/acl');
var aclSelect         = require('./directive/acl-select');  
var builtDataService  = require('./services/built-data-service');  

module.exports = angular.module('appAcl', [])
  .service('appAclService', appAclService)
  .service('aclDataService', builtDataService)
  .directive('aclSelect', aclSelect);

