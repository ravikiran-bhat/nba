/*
  Pre post calls service can contain methods that need to be called after or before or after a call is made to the server.
  For eg: On application create, we need to make around 3 calls. The method for those calls can be declared here.
*/

module.exports = [
  '$state',
  '$q',
  'builtApi',
  'appCacheService',
  'constants',
  function($state, $q, builtApi, appCacheService, constants) {
    var app                 = "";
    var api_key             = "";
    var appConst            = _.cloneDeep(constants.applications.app);
    var retainedCustomRoles = [];

  }
]