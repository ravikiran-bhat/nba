'use strict';
module.exports = [
  'aclDataService',
  function(builtApi) {
    return {
      replace: true,
      restrict: 'A',
      scope: {
        data         : '=data',
        aclType      : '@aclType',
        selectedData : '=selecteddata',
        apikey       : '=apikey',
        apihost      : "=apihost",
        prefix       : "=prefix",
        authtoken    : "=authtoken"  
      },
      link: function(scope, elem, attrs) {
        var selectBox = $('#acl-' + scope.aclType + '-select');
        var anonymousObj = {};
        anonymousObj = {
          id       : "anonymous",
          uid      : "anonymous",
          text     : "Anonymous (Non logged in users)",
          username : "Anonymous (Non logged in users)"
        };

        function getUserText(obj) {
          var html = '';
          var format = {
            n: $.trim((obj.first_name ? obj.first_name : "") + ' ' + (obj.last_name ? obj.last_name : "")),
            e: obj.email,
            u: obj.uid,
            t: obj['_tenant'] ? ('Tenant: ' + obj['_tenant']) : ''
          }

          for (var key in format) {
            if (_.isEmpty(format[key]))
              continue;
            html += '<p>' + format[key] + '</p>'
          }
          return html;
        }
 
        //throttle function for select2
        var searchACL = _.throttle(function(query) {
          return getAcl(scope.aclType, query)
            .then(function(data) {
                var dataArr = data.objects.map(function(obj) {
                obj["id"]   = obj.uid;
                obj["text"] = scope.aclType == "users" ? getUserText(obj) : obj.name;
                return obj;
              });

              if (scope.aclType == "users" && !checkIfAnonymous() && matchForAnonymous(query)) {
                dataArr.splice(0, 0, anonymousObj)
              }

              return {
                results: dataArr //array of data objects
              };
            });
        }, 1000);

        //empty the selectbox when data is added
        scope.$watch('selectedData', function(newValue, oldValue) {
          if (_.isEmpty(newValue)) {
            selectBox.select2('val', "");
          }
        })

        selectBox.select2({
          minimumInputLength: 1,
          multiple: true,
          closeOnSelect: false,
          placeholder: "Select application " + scope.aclType,
          formatResultCssClass: function(){
            return scope.aclType == 'users' ? 'sel-ui': '';
          },
          escapeMarkup: function(m) {
            return m;
          },
          query: function(query) {
            searchACL(query.term).then(query.callback);
          }
        });

        // changing value on change event
        selectBox.on('change', function(e) {
          scope.selectedData["data"] = selectBox.select2('data');
        })
                 
        //GET acls oN select2 input
        function getAcl(aclType, searchStr) {
          var query = {
            "uid": {
              "$nin": getUidEncodeParams(scope.data.ACL[aclType])
            }
          }
          var params = {
            query: JSON.stringify(query),
            "typeahead": searchStr,
            "include_tenant_name": true
          };

          if (scope.aclType === "users") {
            params["only"] = JSON.stringify({
              "BASE": ['uid', 'username', 'email','tenant_id']
            });
            var args = {
              options: {
                classUid: 'built_io_application_user',
                query: params
              }
            }
          }
          if (scope.aclType === "roles") {
            params["only"] = JSON.stringify({
              "BASE": ['uid', 'name']
            });
            var args = {
              options: {
                classUid: 'built_io_application_user_role',
                query: params
              }
            }
          }
          return builtApi.Objects.getAll(args)
        }

        //To encode query parameters with stringified array of Uids
        function getUidEncodeParams(arr) {
          var arrIds = arr.map(function(obj) {
            return obj.uid;
          });
          return arrIds
        }

        function checkIfAnonymous() {
          for (var i = 0; i < scope.data.ACL.users.length; i++) {
            if (scope.data.ACL.users[i].uid === "anonymous") {
              return true;
            }
          }
          return false;
        }

        function matchForAnonymous(query) {
          var reg = new RegExp(query, 'i');
          if ('anonymous'.match(reg) != null) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  }
]