'use strict';

var configFile = require('../config.json');

module.exports = [
  'constants',
  'utilsService',
  'builtApi',
  function(constants, Utils,builtApi) {
    this.fieldCtrl = function($scope, $modalInstance, data) {
      $scope.editMultiple     = configFile.defaults.classes.editMultiple;
      $scope.errors           = [];
      $scope.parentUid        = data.parentUid;
      $scope.parentField      = data.parentField;
      $scope.isGroupMultiple  = data.isGroupMultiple;
      var field = {
        uid          : null,
        data_type    : "text",
        display_name : "",
        mandatory    : false,
        max          : null,
        min          : null,
        multiple     : false,
        format       : "",
        unique       : null,
        uniquePath   : [],
        action       : "add",
        field_metadata: {
          allow_rich_text : false,
          multiline       : false
        },
        compound_index: {
          allow_unique_path: false
        }
      }

      $scope.originalData = R.cloneDeep(data);

      if (_.isEmpty(data.field)) {
        data.field        = R.cloneDeep(field);
        $scope.isNewField = true;
      } else {
        $scope.isNewField = false;
      }
      $scope.data            = data;
      $scope.validUid        = null;
      $scope.clssdata        = data.clssdata;
      $scope.clss            = data.clss;
      $scope.isEdit          = data.isEdit;
      $scope.isUniqueHidden  = false;

      
      $scope.uniquefielddata = [{
        id   : "global",
        text : "Globally Unique"
      }, {
        id   : "local",
        text : "Locally Unique"
      }]


      $scope.activeDataType = getSelectedDataType(data.field.data_type, data.allDataTypes);

      console.log("activeDataType",$scope.activeDataType)
      
      /**
       * Validates UID for any non alphanumeric characters and changes color of the UID input.
      */
      $scope.grplevelcount = data.grplevelcount;
      $scope.validateUID = function($event) {
        var uid = $scope.data.field.uid;

        if (_.isEmpty(uid)) {
          $scope.validUid = null;
          return;
        }

        $scope.validUid = uid.match(constants.regex.uid) == null ? false : true;
      }

      /**
       * Auto populates the uid field with valid charecters.
      */
      $scope.autoFillUID = function($event) {
        $scope.data.field.uid = Utils.createUID($scope.data.field.display_name);
        $scope.validUid = null;
      }

      $scope.ok = function() {
        $scope.errors.length = 0;
        if(data.field.field_metadata && data.field.field_metadata.allow_rich_text){
          data.field.max = undefined;
          data.field.min = undefined;
        }
        if (_.isEmpty($scope.data.field.display_name))
          $scope.errors.push('Display name cannot be blank.');

        if (_.isEmpty($scope.data.field.uid))
          $scope.errors.push('UID cannot be blank.');

        if (!_.isEmpty($scope.data.field.uid) && $scope.data.field.uid.match(constants.regex.uid) == null)
          $scope.errors.push('UID is not valid.');

        if ($scope.data.field.data_type === 'reference' && _.isEmpty($scope.data.field.reference_to))
          $scope.errors.push('Reference class cannot be blank.');

        if (!$scope.errors.length)
          $modalInstance.close(data.field);

        return false;
      }

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      }

      $scope.selectedCheck = function(selObj) {
        if ($scope.data.field.data_type === selObj.field_type) {
          $scope.activeDataType          = selObj;
          var action                     = $scope.data.field.action
          var display_name               = $scope.data.field.display_name
          var uid                        = $scope.data.field.uid
          if(selObj.field_type === R.cloneDeep($scope.originalData).field.data_type){
            $scope.data.field = R.cloneDeep($scope.originalData.field)
            return;
          }
          $scope.data.field              = R.cloneDeep(field);
          $scope.data.field.action       = action
          $scope.data.field.display_name = display_name
          $scope.data.field.uid          = uid
          $scope.data.field.data_type    = selObj.field_type
        }
      }

      function getSelectedDataType(selItem, obj) {
        for (var i = 0; i < obj.length; i++) {
          if (obj[i].field_type === selItem) {
            return obj[i];
          }
        }
      }

      /*$scope.$watch("data.field.data_type",function(o,n){
       if(!$scope.editMultiple)
        if(data.field.data_type === "reference")
          data.field.multiple = true;
      })*/
    }
  }
]