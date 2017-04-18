'use strict';
var listBuilderTemplate  = require('../partials/class-field.html');
var schemaOverlay        = require('../partials/class-field-modal.html');
var InbuiltSchemaOverlay = require('../partials/Inbuilt-class-field-modal.html');


module.exports = ['modalService', 'classBuilderService', 'alertService','knowledgeBaseService',
  function(fieldModal, classBuilderService, Alert,kBservice) {
    return {
      template: listBuilderTemplate,
      replace: true,
      restrict: 'A',
      scope: {
        field           : '=field',
        clssdata        : '=clssdata',
        grplevelcount   : '=grplevelcount',
        prop            : '=prop',
        dtypes          : '=dtypes',
        clss            : '=clss',
        isEdit          : '=isEdit',
        parentUid       : '=parentUid',
        parentField     : '=parentField',
        isGroupMultiple : '=isGroupMultiple'
      },
      link: function(scope, elem, attrs) {
        //specifies the level of group
        scope.grplevelcount       = scope.field.data_type === "group" ? scope.grplevelcount+1 : scope.grplevelcount
        var originalClassData     = _.cloneDeep(scope.clssdata);
        var resultArray           = [];
        scope.actions             = (scope.field.data_type === "group") ? ["Add", "Edit", "Delete"] : ["Edit", "Delete"];
        scope.inbuiltClassActions = ["Edit"];
        scope.hideTitleip         = (scope.field.data_type === "text" && scope.field.multiple != true);
        scope.showgrp             = false;
        scope.singleField         = scope.field;        
        scope.grpToggleTxt        = "Expand";
        // scope.parentUid           = scope.parentUid;
        // if(scope.field.data_type === "group"){
        //   scope.parentUid = scope.parentUid ? scope.parentUid + '.'+ scope.field.uid: scope.field.uid
        // }

        //DOM
        scope.showFieldMeta = false;
        scope.toggleGrp = function() {
          scope.showgrp = !scope.showgrp;
          if (scope.showgrp)
            scope.grpToggleTxt = "Collapse";
          else
            scope.grpToggleTxt = "Expand";
        }

        // check if show is true or false
        function checkIfDisplayField() {
          if (typeof(scope.clssdata.options) != "undefined") {
            if (scope.clssdata.options.showFields && scope.clssdata.options.showFields[scope.field.uid]) {
              elem.find('.chk-display').prop("checked", true);
            }
          }
        }

        checkIfDisplayField()

        //Change ShowField on click event
        elem.find('.chk-display').on('click', function(e) {

          var wasChecked = $(e.currentTarget).prop("checked");
          $('.cft-row-inner .chk-row').removeAttr("checked");
          if (wasChecked)
            $(e.currentTarget).prop("checked", true);

        });

        elem.find('.chk-display').on('change', function() {
          if ($(this).prop('checked') === undefined || $(this).prop('checked') === false) {
            scope.clssdata.options.showFields[scope.field.uid] = false;
          } else {
            if(!scope.clssdata.options)
              scope.clssdata.options = {};
            if(!scope.clssdata.options.showFields)
              scope.clssdata.options.showFields = {};
            scope.clssdata.options.showFields[scope.field.uid] = true;
          }
        });

        //select uid which is active as title
        function checkIfTitle() {
          if (typeof(scope.clssdata.options) != "undefined") {
            if (scope.clssdata.options.title === scope.field.uid) {
              elem.find('.chk-title').prop("checked", true);
            }
          }
        }
        
        checkIfTitle();

        //Change title on click event
        elem.find('.chk-title').on('click', function(e) {

          var wasChecked = $(e.currentTarget).prop("checked");
          $('.cft-row-inner .chk-title').removeAttr("checked");
          if (wasChecked)
            $(e.currentTarget).prop("checked", true);

        });

        elem.find('.chk-title').on('change', function() {
          if ($(this).prop('checked') === undefined || $(this).prop('checked') === false) {
            scope.clssdata.options.title = '';
          } else {
            if(!scope.clssdata.options)
              scope.clssdata.options = {};
            scope.clssdata.options['title'] = scope.field.uid;
          }
        });

        //check the value of unique field data
        scope.checkUnique = function(uniquePath) {
          // debugger;
          if(scope.field.unique && scope.field.uniquePath && scope.field.uniquePath.length > 0) {
            scope.displayText = 'Compound unique'
          }
          else if(scope.field.unique && ( (uniquePath && uniquePath.length === 0) || !uniquePath)) {
            scope.displayText = 'Unique'
          }
          else if(!scope.unique && !uniquePath) {
            scope.displayText = 'Not unique'
          }
        }
        
        //Add new fields to class [Required for group field]
        function addFields(gridItem,clss) {
          var parentUid       = scope.parentUid ? scope.parentUid + '.' + scope.field.uid : scope.field.uid
          var parentField     = scope.parentField ? scope.parentField : scope.field
          var isGroupMultiple = scope.isGroupMultiple ? scope.isGroupMultiple : scope.field.multiple
          var modalData = {
            includeMandatory : true,
            allDataTypes     : scope.dtypes,
            grplevelcount    : scope.grplevelcount,
            field            : {},
            clssdata         : scope.clssdata ? angular.copy(scope.clssdata) : [],
            clss             : clss,
            isEdit           : false,
            parentUid        : parentUid,
            parentField      : parentField,
            isGroupMultiple  : isGroupMultiple
          }

          fieldModal.openModal(modalData, schemaOverlay, classBuilderService.fieldCtrl)
            .then(function(selectedItem) {
              if (typeof(scope.clssdata.schema[scope.prop].schema) === "undefined") {
                scope.clssdata.schema[scope.prop].schema = [];
              }
              scope.clssdata.schema[scope.prop].schema.push(selectedItem);
              if(selectedItem.uniquePath && selectedItem.uniquePath.length) {
               kBservice.addField(parentUid ? parentUid + '.' + selectedItem.uid : selectedItem.uid,selectedItem.uniquePath);
              }
              scope.singleField = selectedItem;
            }, function(err) {
            });
        }
        function editInBuiltField(field, index){
          var includeMandatory = scope.clssdata.schema[index].field_metadata ? scope.clssdata.schema[index].field_metadata.mandatory === undefined : true;          
          var clonedField      = _.cloneDeep(field);
          var modalData = {
            includeMandatory : includeMandatory,
            allDataTypes   : scope.dtypes,
            grplevelcount  : scope.grplevelcount,
            originalFields : originalClassData.schema[scope.prop],
            field          : clonedField,
            inBuilt        : true,
            isEdit         : true,
            clssdata       : originalClassData
          };
          fieldModal.openModal(modalData, InbuiltSchemaOverlay, classBuilderService.fieldCtrl)
          .then(function(res) {
            console.log("res",res)
            scope.clssdata.schema[scope.prop] = res;
          });
        }

        //Edit specified field of class
        function edit(field, index, clss) {
          var includeMandatory = scope.clssdata.schema[index].field_metadata ? scope.clssdata.schema[index].field_metadata.mandatory === undefined : true
          var clonedField      = _.cloneDeep(field);
          var modalData = {
            includeMandatory : includeMandatory,
            allDataTypes     : scope.dtypes,
            grplevelcount    : scope.grplevelcount,
            originalFields   : originalClassData.schema[scope.prop],
            field            : clonedField,
            isEdit           : true,
            clssdata         : originalClassData,
            clss             : clss,
            parentUid        : scope.parentUid,
            parentField      : scope.parentField,
            isGroupMultiple  : scope.isGroupMultiple
          }


          /***
           *
           *@service  modalService
           *@param modalData     : data required by modal
           *@param schemaOverlay : template required by modal
           *@service classBuilderService
           *@param classBuilderService.fieldCtrl : ModalInstance Controller
           *@desc
           *
          ***/
          fieldModal.openModal(modalData, schemaOverlay, classBuilderService.fieldCtrl)
            .then(function(res) {
              var checkUnique   = kBservice.searchField(scope.parentUid ? scope.parentUid + '.' + scope.field.uid : scope.field.uid);
              if(checkUnique.length){
                var calculatedUid = (res.data_type === "group") ?  scope.field.uid : scope.parentUid ? scope.parentUid + '.' + scope.field.uid : scope.field.uid;
                if(scope.field.uid !== res.uid || (!scope.field.multiple && res.multiple)) {
                  Alert.notify({
                    title: 'Error!',
                    content: "The`" + calculatedUid + "` field uid cannot be modified or marked multiple as it's included in the unique path of the `" + checkUnique.join(', ') + "` field(s)",
                    type: 'error'
                  });
                  // return
                  res.uid       = scope.field.uid;
                  res.multiple  = scope.field.multiple;
                }
                
                if((scope.field.data_type != res.data_type)){
                  Alert.notify({
                    title: 'Error!',
                    content: "The data type of the `" + calculatedUid + "` field cannot be modified as it's included in the unique path of the `" + checkUnique.join(', ') + "` field(s)",
                    type: 'error'
                  });
                  // return
                  res.data_type = scope.field.data_type;
                  
                  if(scope.field.schema)
                   res.schema = scope.field.schema;
                  
                  if(scope.field)
                    res = scope.field;
                }

                if(!scope.field.unique && res.unique && !res.action) {
                  Alert.notify({
                    title: 'Error!',
                    content: "The`" + calculatedUid + "` field cannot be marked unique as it's included in the unique path of the `" + checkUnique.join(', ') + "` field(s)",
                    type: 'error'
                  });
                  // return
                  res.unique = scope.field.unique
                }

                if((scope.field.unique && res.unique) && (scope.field.uniquePath && scope.field.uniquePath.toString()) !== (res.uniquePath && res.uniquePath.toString()) && !res.action) {
                  Alert.notify({
                    title: 'Error!',
                    content:"The unique path of `"+ calculatedUid + "` field marked unique cannot be modified as it's included in the unique path of the `" + checkUnique.join(', ') + "` field(s)",
                    type: 'error'
                  });
                  // return
                  res.uniquePath = scope.field.uniquePath
                }
              }
              if(res.uniquePath && res.uniquePath.length) {
                kBservice.deleteField(scope.parentUid ? scope.parentUid + '.' + scope.field.uid : scope.field.uid);
                kBservice.addField(scope.parentUid ? scope.parentUid + '.' + res.uid : res.uid,res.uniquePath);
              }
              else if((scope.field.uniquePath && scope.field.uniquePath.length) && !(res.uniquePath && res.uniquePath.length)) {
                kBservice.deleteField(scope.parentUid ? scope.parentUid + '.' + scope.field.uid : scope.field.uid);
              }
              scope.actions                     = (res.data_type === "group") ? ["Add", "Edit", "Delete"] : ["Edit", "Delete"];
              scope.hideTitleip                 = (res.data_type === "text" && res.multiple != true);
              scope.clssdata.schema[scope.prop] = res;
              scope.field                       = res;
              scope.singleField                 = scope.field;
            });
        }

        //Delete field from class schema
        function del(gridItem, index) {
          Alert.confirm({
            title: 'Delete field',
            content: 'Are you sure you want to delete this field?'
          }).then(function() {
              var checkUnique = kBservice.searchField(scope.parentUid ? scope.parentUid + '.' + scope.field.uid : scope.field.uid);
              var parentUid   = (scope.field.data_type === "group") ?  scope.field.uid : scope.parentUid ? scope.parentUid + '.' + scope.field.uid : scope.field.uid;
              if(!checkUnique.length) {
                scope.clssdata.schema.splice(index, 1);
                kBservice.deleteField(scope.parentUid ? scope.parentUid + '.' + scope.field.uid : scope.field.uid);
              }
              else {
                Alert.notify({
                  title: 'Error!',
                  content: "The`" + parentUid + "` field cannot be deleted as it's included in the unique path of  the `" + checkUnique.join(', ') + "` field(s)",
                  type: 'error'
                });
              }
          });
        }

        //return match value of array of objects
        function getSelOnLoad(selItem, obj) {
          for (var i = 0; i < obj.length; i++) {
            if (obj[i].field_type === selItem) {
              return obj[i];
            }
          }
        }

        //Attached action events for each field
        scope.performAction = function(act, gridItem, index,clss) {
          if (act === 'Add') {
            return addFields(gridItem,clss);
          }
          if (act === 'Edit') {
            return edit(gridItem, index,clss);
          }
          if (act === 'Delete')
            return del(gridItem, index);
        }

        scope.performInBuiltClassAction = function(act, gridItem, index) {
          if (act === 'Edit')
            return editInBuiltField(gridItem, index);
        }
        
        /**
         * Toggles field meta data. (Visible when in responsive mode.)
        */
        
        scope.toggleFieldMeta = function() {
          scope.showFieldMeta = !scope.showFieldMeta;
        }

        /*function storeClssValues(fldUid,uniquePath) {
          scope.createObj(fldUid.uid,uniquePath);
        }*/

        /*scope.createObj = function(fieldUid,uniquePath) {
          debugger;
          console.log("storeArry",scope.knowledgeBase)
          scope.knowledgeBase[fieldUid] = uniquePath;
          console.log("storeArry 1111",scope.knowledgeBase)
        }*/
      }
    }
  }
]