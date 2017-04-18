var fieldSelectModalTmpl = require('../partials/field-select-modal.html');

module.exports = [
  'oqBuiltDataService',
  'utilsService',
  'tip',
  'constants',
  'coreManageUtilsService',
  function(builtApi, Utils, TIP, constants, coreManageUtils) {
    var self = this;
    var mc   = coreManageUtils.klass;
    var mcs  = mc.schema;

    function modifyInbuiltSchema(clsdata){
        if (mc.isAppUser(clsdata.uid)) {
        clsdata.schema = mcs.addDeviceType(clsdata.schema);
      }

      if (coreManageUtils.klass.isBltInstallation(clsdata.uid)) {
        clsdata.schema = mcs.addDeviceType(clsdata.schema);
        clsdata.schema = mcs.addTimezone(clsdata.schema);
      }
      return clsdata
    }
    var tipOptions = {
      content: {
        text: function(api) {
          return 'Please enter a valid value';
        },
      },
      hide: {
        event: 'click'
      },
      events: {
        hide: function(event, api) {
          $(this).qtip("destroy");
        }
      },
      position: {
        adjust: {
          x: -1
        }
      },
      style: {
        classes: "qtip-red"
      }
    };

    var app_user_object_uid = "app_user_object_uid";
    var restrictedDatatypes = ['file', 'mixed', 'link'];
    var inbuiltClassFields = _.cloneDeep(constants.classes.inbuiltFields)

    this.fieldSelectModalTmpl = fieldSelectModalTmpl;

    this.isGroup = function(field) {
      return field.data_type === "group";
    }

    this.isReference = function(field) {
      return field.data_type === "reference";
    }

    this.formatClassFields = function(schema, includeInbuiltFields) {
      if(includeInbuiltFields)
        schema = schema.concat(inbuiltClassFields);

      return _.filter(schema, function(obj) {
        if (!_.contains(restrictedDatatypes, obj.data_type)) {
          obj['id'] = obj.uid;
          obj['text'] = obj.display_name;
          return true;
        } else {
          return false;
        }
      })
    }

    this.showErrorTips = function(els, o) {
      var options = _.extend({}, tipOptions, (o || {}))
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        var opts = _.cloneDeep(options);
        if(el.data('error-text'))
          opts.content.text = function(api){return el.data('error-text')};
        TIP.show(el, opts);
      }
    }

    this.destroyErrorTips = function(elem) {
      var tipSelector = elem.find('[rel=tooltip]');
      TIP.destroy(tipSelector);
      tipSelector.tooltip('destroy');
      // tipSelector.on('hidden.bs.tooltip', function(){
      //   console.log("Tooltip has been completely closed.");
      // });

    }

    this.destroyTip = function(el) {
      TIP.destroy(el);
    }

    this.fieldSelectModalCtrl = function($scope, $modalInstance, data) {
      
      var fieldSelect = null;
      var fieldDepth  = 0;
      $scope.nestedFieldData = data.data.query.fieldData; // Group field or reference field.
      $scope.currentQuery = data.data.currentQuery;
       //This is set to track the key name for the nested owner fields other than UID
      $scope.currentQuery.currentQueryKey = app_user_object_uid;

      // DOM
      $scope.refLoading = false;
      $scope.refError = false;

      setTimeout(function() {
        fieldSelect = $('.js-select-field-modal-select');
        checkSelectedField();
      }, 0);

      function checkSelectedField() {
        Utils.sa($scope, function() {
          //Check if group
          if (self.isGroup($scope.nestedFieldData.currentField)){
            initFieldSelect($scope.nestedFieldData.currentField)
          }
          //Else check if reference
          else if(self.isReference($scope.nestedFieldData.currentField)) {
            $scope.refLoading = true;
            getReferenceField($scope.nestedFieldData.currentField)
              .then(function(classObject) {
                classObject = modifyInbuiltSchema(classObject)
                //If owner push app_user_object_uid else push uid for reference fields
                if($scope.nestedFieldData.name ==="Owner"){
                  console.log("in if owner")
                  classObject.schema.push({
                    uid: app_user_object_uid,
                    data_type: "text",
                    display_name: "UID"
                  });
                $scope.currentQuery._value = {};
                $scope.nestedFieldData._class_uid = classObject.uid;
                }else{
                  console.log("in else")
                  
                  $scope.currentQuery._value['_key'] = '$select';
                  $scope.currentQuery._value['_value'] = {
                    key: 'uid',
                    class_uid: classObject.uid,
                    query: {
                      _key: '',
                      _value: {},
                      fieldData: $scope.nestedFieldData
                    }
                  };

                // change current query value - Basically narrow the scope of the query.
                $scope.currentQuery = $scope.currentQuery._value['_value']['query'];

                //This is set to track the key name for the nested owner fields other than UID
                  $scope.currentQuery.currentQueryKey = $scope.nestedFieldData.currentField.id;

                // set current query path.
                $scope.nestedFieldData.currentQueryPath = Utils.joinStr($scope.nestedFieldData.currentQueryPath, '_value._value.query');
              }

                // Initialize the selectbox with new fields.
                initFieldSelect(classObject);

              }, function(xhr) {
                $scope.refError = true;
              }).finally(function() {
                $scope.refLoading = false;
              });
          }
          else{
            
            //For all nested owner fields other then UID
            if(!ownerUidIsSet($scope.nestedFieldData.name) && ifNestedOwnerField($scope.nestedFieldData.name)){
              $scope.currentQuery._key = $scope.currentQuery.currentQueryKey;
              $scope.currentQuery._value['_key'] = '$select';
              $scope.currentQuery._value['_value'] = {
                key: 'uid',
                class_uid: $scope.nestedFieldData._class_uid,
                query: {
                  _key: $scope.nestedFieldData.currentField.id,
                  _value: {},
                  fieldData: $scope.nestedFieldData
                }
              };

              // change current query value - Basically narrow the scope of the query.
              $scope.currentQuery = $scope.currentQuery._value['_value']['query'];

              // set current query path.
              $scope.nestedFieldData.currentQueryPath = Utils.joinStr($scope.nestedFieldData.currentQueryPath, '_value._value.query');
            }
          }
        });
      }

      /*function initFieldSelect(currentField) {
        // Iterate fields and add id and text keys to the fields in field.schema
        var fields = self.formatClassFields(currentField.schema, false);

        if (fieldSelect.data('select2') !== undefined) {
          fieldSelect.select2('destroy');
        }

        fieldSelect.val(null);
        fieldSelect.select2({
          data: fields
        })

        fieldSelect.off('change').on('change', function() {
          Utils.sa($scope, function() {
            $scope.nestedFieldData.currentField = fieldSelect.select2('data');
            
            //Setting nested field name
            $scope.nestedFieldData.name += '.' + fieldSelect.select2('data').display_name;
            if(!self.isGroup($scope.nestedFieldData.currentField) && !self.isReference($scope.nestedFieldData.currentField)){
              $scope.nestedFieldData.name = stripSuffix(_.cloneDeep($scope.nestedFieldData.name));
            }

            //Setting nested field key
            if(!ownerUidIsSet($scope.nestedFieldData.name)){

            //check if object data type is not a group or reference or owner
              if(!self.isGroup($scope.nestedFieldData.currentField) && !self.isReference($scope.nestedFieldData.currentField) && !ifNestedOwnerField($scope.nestedFieldData.name)){
                $scope.currentQuery._key  = $scope.nestedFieldData.currentField.uid;          
              }else if(ifNestedOwnerField($scope.nestedFieldData.name)){
                var currentKey            = Utils.joinStr($scope.currentQuery._key, $scope.nestedFieldData.currentField.uid);
                $scope.currentQuery._key  = stripSuffix(currentKey);
                checkSelectedField();
              }else{
                $scope.currentQuery._key  = Utils.joinStr($scope.currentQuery._key, $scope.nestedFieldData.currentField.uid)
                checkSelectedField();
              }
            }
          })
        });
      }*/
      function initFieldSelect(currentField) {

        // Iterate fields and add id and text keys to the fields in field.schema
        var fields = self.formatClassFields(currentField.schema, false);

        if (fieldSelect.data('select2') !== undefined) {
          fieldSelect.select2('destroy');
        }

        fieldSelect.val(null);
        fieldSelect.select2({
          data: fields
        })

        fieldSelect.off('change').on('change', function() {
          Utils.sa($scope, function() {
            $scope.nestedFieldData.currentField = fieldSelect.select2('data');
            if(!self.isGroup($scope.nestedFieldData.currentField) && !self.isReference($scope.nestedFieldData.currentField)){
              var nestedNameString = _.cloneDeep($scope.nestedFieldData.name);
              if(fieldDepth >= 1){
                var nestedNameArray = nestedNameString.split('.');
                nestedNameArray.pop();
                $scope.nestedFieldData.name = nestedNameArray.join('.');
              }
              fieldDepth++;
            }

            $scope.nestedFieldData.name += '.' + fieldSelect.select2('data').display_name;
            
            if(!ownerUidIsSet($scope.nestedFieldData.name) && !(self.isReference($scope.nestedFieldData.currentField) && ifNestedOwnerField($scope.nestedFieldData.name))){
              $scope.currentQuery._key = Utils.joinStr($scope.currentQuery._key, $scope.nestedFieldData.currentField.uid);
            }

            if(!ownerUidIsSet($scope.nestedFieldData.name)){
              checkSelectedField();
            }

            if(!self.isGroup($scope.nestedFieldData.currentField) && !self.isReference($scope.nestedFieldData.currentField)){
              $scope.ok();
            }
          })
        });
      }

      function ownerUidIsSet(fieldName){
        return fieldName==="Owner.UID";
      }

      /*function stripSuffix(str){
        var keyArray = str.split('.');
        if(keyArray.length===2)
          return str;

        return keyArray[0]+'.'+keyArray[keyArray.length - 1]
      }*/

      function ifNestedOwnerField(fieldName){
        return fieldName.indexOf('Owner.')!=-1;
      }

      function getReferenceField(field) {
        return builtApi.Classes.getOne({
          options: {
            classUid: field.reference_to
          }
        })
      }

      $scope.ok = function() {
        if(_.isEmpty(fieldSelect.select2('data')))
          return;
        var responseObject = {
          currentData: {
            query: data.data.query
          }
        };

        responseObject.currentData["currentQuery"] = $scope.currentQuery;
        $modalInstance.close(responseObject);
      }

      $scope.cancel = function() {
        $modalInstance.dismiss();
      };
    }
  }
]