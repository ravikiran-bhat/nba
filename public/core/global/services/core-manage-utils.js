'use strict';
module.exports = [
  'constants',
  function(constants) {
    
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