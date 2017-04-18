'use strict';
module.exports = [
  'appCacheService',
  'builtApi',
  'alertService',
  '$state',
  'constants',
  'utilsService',
  function(appCacheService, builtApi, Alert, $state, constants, Utils) {
    var defaultRoleStatus = false;
    this.applications = {

      getRestrictionMsg: function(isShared) {
        return {
          title: isShared ? 'Access denied' : 'Upgrade your plan!',
          classes: isShared ? 'fa-exclamation-triangle txt-color-redLight' : 'fa-lock txt-color-green',
          content: isShared ? 'You do not have sufficient permissions to access this functionaliy. Please contact the owner of this application.' : 'This feature is not available in your current plan or your API limit for this feature is exceeded. Do you want to upgrade your plan?'
        }
      },
      checkRestriction: function(restricted, isShared) {
        if (!!!restricted)
          return true;

        var options = this.getRestrictionMsg(isShared);

        if (isShared)
          Alert.confirm(_.extend({
            buttons: '[Dismiss]'
          }, options));
        else
          Alert.confirm(options)
          .then(function() {
            $state.go('app.account.plans');
          });

        return false;
      }
    }
    this.cache = {
      clearAppHeaderKeys: function() {
        builtApi.removeHeaderKey('application_api_key');
        builtApi.removeHeaderKey('tenant_uid');
      },
      clearAppRelatedCache: function() {
        appCacheService.remove(
          'currentClass',
          'currentObject',
          'analyticsEvents',
          'segBookmarks',
          'collaborators',
          'permissions',
          'devManager',
          'contentManager',
          'integration'
          );
      }
    }

    this.klass = {
      isAppUser : function(uid){
        return uid==='built_io_application_user';
      },
      isBltInstallation : function(uid){
        return uid==='built_io_installation_data';
      },
      schema: {
        addDeviceType: function(schema){
          var index = _.findIndex(schema, {uid : 'device_type'});
          schema[index] = configureSelectField(schema[index], constants.deviceType)
          return schema;
        },
        revertDeviceType:function(schema){
          var index = _.findIndex(schema, {uid : 'device_type'});
          schema[index] = changeSelectField(schema[index])
          return schema;
        },
        addTimezone : function(schema){
           var index = _.findIndex(schema, {uid : 'timezone'});
          schema[index] = configureSelectField(schema[index], constants.timezones);
          return schema;
        },
        revertTimezone: function(schema){
          var index = _.findIndex(schema, {uid : 'timezone'});
          schema[index] = changeSelectField(schema[index]);
          return schema;
        },
        addPasswordField : function(schema){
          var index = _.findIndex(schema, {uid : 'password'});
          
          //set current password field type as password
          schema[index] = changeCurrentFieldDateType(schema[index], "password");
          schema.splice(index + 1, 0, {
            display_name: "Password confirmation",
            uid: "password_confirmation",
            data_type: "password",
            field_metadata: {
              inbuilt_field: true
            },
            unique: null,
            mandatory: false,
            multiple: false
          });
          return schema;
        },
        removeAuth: function(schema){
          var AuthTokenIndex = _.findIndex(schema, {uid : 'authtokens'});
          schema.splice(AuthTokenIndex, 1);

          var AuthDataIndex = _.findIndex(schema, {uid : 'auth_data'});
          schema.splice(AuthDataIndex, 1);
          return schema;
        }
      }
    }

    this.setAppHeaders = function(app){
      var headers = {
        application_api_key: app.api_key
      };
      
      if (Utils.isTenantSet(app)) {
        headers['tenant_uid'] = app.discrete_variables.tenant;
        appCacheService.set('currentTenant', headers['tenant_uid']);
      }else{
        appCacheService.remove('currentTenant');
      }
      builtApi.setHeaders(headers);
    }

    function changeCurrentFieldDateType(data, type){
      data.data_type = type;
      return data;
    }

    function configureSelectField(field, typeData) {
      field.data_type = 'select';
      field.field_metadata['__blt_data'] = {
        __blt_select: typeData
      };
    return field;
    }

    function changeSelectField(field){
      field.data_type = 'text';
      return field;
    }
  }
]