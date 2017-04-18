'use strict';
var aclOverlayTemplate = require('../partials/acl.html');
//var builtDataService   = require('./built-data-service'); 

module.exports = [
  '$q',
  'aclDataService',
  'utilsService',
  function($q, builtDataService, Utils) {
    this.aclOverlayTemplate = aclOverlayTemplate;

    this.aclCtrl = function($scope, $modalInstance, data) {
      var defaultRights = makeRightPresets();
      $scope.apikey     = data.api_key;
      $scope.apihost    = data.api_host;
      $scope.authtoken  = data.authtoken;
      $scope.prefix     = data.prefix;
      data.ACL.users    = data.ACL['users'] || [];
      data.ACL.roles    = data.ACL['roles'] || [];
      data.ACL.others   = data.ACL['others'] || makeOthersRights();
      data.isDefault    = data['isDefault'] || false;

      if (!data.isDefault)
        data.ACL.disable = data.ACL['disable'] || false;

      $scope.data              = _.cloneDeep(data);
      $scope.ACLType           = 'users';
      $scope.userSelectedData  = {}; //selected data of users from selectbox directive
      $scope.rolesSelectedData = {}; //selected data of roles from selectbox directive
     
      /*
        Create a rights object for users and roles based on given default rights in data.rights
        Used in add more user and add more roles section.
       */
      $scope.userRightPresets = _.cloneDeep(defaultRights);
      $scope.roleRightPresets = _.cloneDeep(defaultRights);


      //Get ACL type selected in Modal Overlay
      $scope.getACLType = function(ACLType) {
        $scope.ACLType = ACLType;
      }

      //Save data in overlay
      $scope.ok = function() {
        $scope.data = Utils.removeKey($scope.data, '$$hashKey');
        $modalInstance.close($scope.data);
      }

      //Cancel overlay
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');

      }

      //Remove Users/Roles from view-list
      $scope.removeACL = function(index, arr) {
        arr.splice(index, 1);
      }

      // Add Users to view-list with combining rights
      $scope.addToUserList = function() {
        if ($scope.userSelectedData.data) {
          var rights = _.cloneDeep($scope.userRightPresets);
          $scope.userSelectedData.data.map(function(obj, index) {
            var o = {};
            o['uid'] = obj.uid;
            o['username'] = obj.username;
            o['email'] = obj.email;
            o['_tenant'] = obj._tenant;
            o = _.assign(o, rights);
            $scope.data.ACL.users.push(o);
          });

          $scope.userSelectedData = {};
        }
      }

      // Add Roles to view-list with combining rights
      $scope.addToRolesList = function() {
        if ($scope.rolesSelectedData.data) {
          var rights = _.cloneDeep($scope.roleRightPresets);
          $scope.rolesSelectedData.data.map(function(obj, index) {
            var o = {};
            o['uid'] = obj.uid;
            o['name'] = obj.name;
            o = _.assign(o, rights);
            $scope.data.ACL.roles.push(o);
          });

          $scope.rolesSelectedData = {};
        }
      }

      //Clear selected data (users/roles)
      $scope.clearList = function(ACLType) {
        if (ACLType === 'users')
          $scope.userSelectedData = {};
        if (ACLType === 'roles')
          $scope.rolesSelectedData = {};
      }

      //Set Headers for dedicated built service
      builtDataService.Header.set({
        application_api_key : $scope.data.api_key,
        apihost             : $scope.data.api_host,
        authtoken           : $scope.data.authtoken,
        tenant_uid          : $scope.data.tenant,
        prefix              : $scope.prefix
      })
        
      function makeRightPresets() {
        var o = {};
        for (var i = 0; i < data.rights.length; i++) {
          o[data.rights[i]] = undefined;
        };
        return o;
      }

      function makeOthersRights() {
        var rights = _.cloneDeep(defaultRights);
        if(data.isDefault) {
          // Make create and read true by default if defaultACL is true.
          rights.read = true;

          if (rights.hasOwnProperty('create'))
            rights['create'] = true;

        }

        return _.extend({}, rights, data.ACL['others'] || {});
      }

      //Call built_io_application_user for user data
      function getUsers(query) {
        if ($scope.data.ACL.users.length) {
          var args = {
            options: {
              classUid: 'built_io_application_user',
              query: query
            }
          }
          return builtDataService.Objects.getAll(args)
        } else
          return $q.reject({});
      }

      //Call built_io_application_role for role data
      function getRoles(query) {
        if ($scope.data.ACL.roles.length) {
          var args = {
            options: {
              classUid: 'built_io_application_user_role',
              query: query
            }
          }
          return builtDataService.Objects.getAll(args)
        } else
          return $q.reject({});
      }

      //to combine user object containing rights and user credentials
      function mapUsers(users) {
        var mappedUsers = $scope.data.ACL.users.map(function(aclUser) {
          _.find(users, function(user) {
            if (aclUser.uid === user.uid) {
              aclUser["email"] = user.email;
              aclUser["username"] = user.username;
              aclUser['_tenant'] = user._tenant;
              aclUser['uid'] = user.uid;
            }
          });
          if (aclUser.uid === "anonymous") {
            aclUser["id"] = "anonymous";
            aclUser["text"] = "Anonymous (Non logged in users)";
            aclUser["username"] = "Anonymous (Non logged in users)";
          }
          return aclUser;
        });
        $scope.data.ACL.users = mappedUsers;
      }

      //to combine role object containing rights and role credentials
      function mapRoles(roles) {
        var mappedRoles = $scope.data.ACL.roles.map(function(aclRole) {
          _.find(roles, function(role) {
            if (aclRole.uid === role.uid) {
              aclRole["name"] = role.name;
              aclRole['uid'] = role.uid;
            }
          });
          return aclRole;
        });

        $scope.data.ACL.roles = mappedRoles;
      }

      function getQuery(aclType) {
        var query = {
          "uid": {
            "$in": getUidEncodeParams($scope.data.ACL[aclType] || [])
          }
        }
        var params = {
          query: JSON.stringify(query),
          include_tenant_name: true
        };

        if ($scope.aclType === "users") {
          params["only"] = JSON.stringify({
            "BASE": ['uid', 'username', 'email', '_tenant']
          });
        }

        if ($scope.aclType === "roles") {
          params["only"] = JSON.stringify({
            "BASE": ['uid', 'name']
          });
        }
        return params;
      }

      //To encode query parameters with stringified array of Uids
      function getUidEncodeParams(arr) {
        var arrIds = arr.map(function(obj) {
          return obj.uid;
        });
        return arrIds
      }

      //get Users Data
      getUsers(getQuery('users'))
        .then(function(res) {
          mapUsers(res.objects);
        })

      //get Role data
      getRoles(getQuery('roles'))
        .then(function(res) {
          mapRoles(res.objects);
        })
    }

  }
]