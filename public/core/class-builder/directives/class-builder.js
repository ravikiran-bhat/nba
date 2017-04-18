'use strict';
var listBuilderTemplate = require('../partials/class-builder.html');
var schemaOverlay       = require('../partials/class-field-modal.html');

module.exports = [
  'constants',
  'utilsService',
  'classBuilderService',
  'modalService',
  'appAclService',
  'knowledgeBaseService',
  function(constants, Utils, classBuilderService, fieldModal, appAclService,knowledgeBaseService) {
    return {
      template: listBuilderTemplate,
      restrict: 'A',
      scope: {
        clssdata      : '=clssdata',
        grplevelcount : '=grplevelcount',
        dtypes        : '=dtypes',
        apikey        : '=',
        classSteps    : '=',
        activeStep    : '=',
        tenant        : '=?',
        apihost       : "=?",
        authtoken     : "=",
        clss          : "=clss",
        isEdit        : '=isEdit'
      },
      link: function(scope, elem, attrs) {
      var SteplistSelector =  elem.find('.bootstrapWizard li');
      var select2elem      = elem.find('.unique-select');
        scope.$watch('clssdata', function(newValue, oldValue){
          if(newValue!= oldValue){
            Utils.onWatchClass.status = true;
          }
        }, true);

        //DOM
        scope.validUid      = null;
        scope.isNewClass    = false;
        scope.cfOptions     = {};
        scope.inbuiltClass  = false;

        if (_.isEmpty(scope.clssdata.uid)) {
          scope.isNewClass = true;
        }

        if (!scope.isNewClass) {
          scope.created_at = getHumanizedDate(scope.clssdata.created_at);
          scope.updated_at = getHumanizedDate(scope.clssdata.updated_at);
        }
        /**
         * Validates UID for any non alphanumeric characters and changes color of the UID input.
        */
        scope.validateUID = function() {
          var uid = scope.clssdata.uid;

          if (_.isEmpty(uid)) {
            scope.validUid = null;
            return;
          }

          scope.validUid = uid.match(constants.regex.uid) == null ? false : true;
        }

        /**
         * Auto populates the uid field with valid charecters.
         */
        scope.autoFillUID = function() {
          if (!scope.isNewClass)
            return;
          scope.clssdata.uid = Utils.createUID(scope.clssdata.title);
          scope.validUid     = null;
        }

        //Add new field to class
        scope.addFields = function() {
          var modalData = {
            includeMandatory  : true,
            allDataTypes      : scope.dtypes,
            grplevelcount     : scope.grplevelcount,
            field             : {},
            clssdata          : scope.clssdata,
            isEdit            : false,
            clss              : scope.clssdata
          }
          fieldModal.openModal(modalData, schemaOverlay, classBuilderService.fieldCtrl)
            .then(function(field) {
              scope.clssdata.schema.push(field);
              if(field.uniquePath && field.uniquePath.length) {
               knowledgeBaseService.addField(field.uid,field.uniquePath);
              }
            });
        }

        scope.changeStep = function(step, e) {
          Utils.sa(scope, function(){
            SteplistSelector.removeClass('active');
            $(e.target).closest('li').addClass('active');
            scope.activeStep = step;
          })
        }

        //Configure Default Acl
        scope.configureDefaultACL = function() {
          var modalData = {
            ACL            : _.cloneDeep(scope.clssdata.DEFAULT_ACL),
            isDefault      : true,
            rights         : ["create", "read", "update", "delete"],
            api_key        : scope.apikey,
            api_host       : scope.apihost,
            authtoken      : scope.authtoken,
            tenant         : scope.tenant,
            prefix         : '/v1'
          };

          fieldModal.openModal(modalData, appAclService.aclOverlayTemplate, appAclService.aclCtrl, {
              keyboard: false
            })
            .then(function(res) {
              scope.clssdata.DEFAULT_ACL = res.ACL;
            }, function(){
            });
        }

        // configure options
        if (!scope.clssdata.options)
          scope.clssdata.options = {};

        if (!scope.clssdata.options.inbuiltFields)
          scope.clssdata.options.inbuiltFields = {
            publish       : false,
            location      : false,
            tag           : false,
            include_owner : false
          }

        scope.cfOptions = scope.clssdata.options.inbuiltFields;


        scope.$watch('cfOptions', function(newValue, oldValue) {
          if (!scope.clssdata.options)
            scope.clssdata.options = {};

          scope.clssdata.options.inbuiltFields = scope.cfOptions;
          // if (scope.cfOptions.publish && scope.cfOptions.location && scope.cfOptions.tag) {
          //   if (scope.clssdata.options.hasOwnProperty('title'))
          //     delete scope.clssdata.options.inbuiltFields;
          //   else
          //     delete scope.clssdata.options;
          // }
        }, true);

        //DOM
        $("[rel=tooltip]").tooltip();

        function getHumanizedDate(date) {
          return moment(date).format('ddd MMM Do, YYYY');
        }

      }
    }
  }
]