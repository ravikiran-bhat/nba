'use strict';

var formBuilderTemplate = require('../partials/formbuilder.html');
var helpModalTemplate   = require('../partials/app-user-role-helper.html');

module.exports = [
  'utilsService',
  'fbBuiltDataService',
  'tip',
  'modalService',
  function(Utils, builtApi, TIP, Modal) {
    return {
      template: formBuilderTemplate,
      restrict: 'A',
      scope: {
        cls                  : '=cls',
        obj                  : '=obj',
        apikey               : '=apikey',
        authtoken            : '=authtoken',
        prefix               : '=prefix',
        viewonly             : '=viewonly',
        classes              : '=?',
        tenant               :'=?',
        apihost              :"=?",
        getQueryNow          :"=getQueryNow",
        getQueryCallback     : "=getQueryCallback",
        userSelectMethod     : "=?",
        enableUsersInAppRole : "=?"
      },
      link: function(scope, elem, attrs) {
        console.log("userSelectMethod in scope",scope.obj)
        if(scope.cls.uid === "built_io_application_user_role"){
          delete scope.obj.users
        }
        var grpRibbon               = $('.jarviswidget-form-builder .fb-group-ribbon');
        scope.groupRibbon           = [];
        scope.configureFieldOptions = {};

        scope.focusOptions          = {
          setNoFocus : false
        };
      
        scope.configureFieldOptions = {
          publish: false,
          tag: false,
          location: false
        };
        
        //set ConfigureOptions if present in class object
        if (scope.cls.options){
          if (scope.cls.options.inbuiltFields){
            scope.configureFieldOptions = scope.cls.options.inbuiltFields;
          }
        }
        
        var defaultGrpRibbon = {
          id: void 0,
          name: scope.cls.title
        };

        scope.scrollTo = function(id) {
          Utils.scrollTo(id ? $('#' + id).offset().top - 100 : 0);
        }

        /*
          Creates group ribbon.
         */
        function makeGrpRibbon() {
          
          if (!$('.form-builder-wrap').length)
            return;

          var viewportSelection = $('.form-builder-wrap .object-form .group-tracker:in-viewport(130)');

          $('.form-builder-wrap .object-form .group-tracker').removeClass('active-group');
          $(viewportSelection).addClass('active-group');
          scope.groupRibbon = [{
            id: void 0,
            name: scope.cls.title
          }];

          for (var i = 0; i < viewportSelection.length; i++) {
            var e = $(viewportSelection[i]);
            scope.groupRibbon.push({
              id: e.attr('id'),
              name: e.data('name')
            });
          }

          Utils.sa(scope);
          if (grpRibbon.css('position') == 'absolute')
            $(document.body).trigger("sticky_kit:recalc")
        }

        /*
          Remove animation classes and make group ribbon sticky
         */
        setTimeout(function() {
          $('#content').removeClass('animated fadeInDown');
          grpRibbon.stick_in_parent();
          $(document.body).trigger("sticky_kit:recalc");
        }, 3000);
        
        //check if the schema's first field is isodate set-no-focus as true
        (function(){
          var classSchema = scope.cls.schema[0];
          if(classSchema.field_metadata && classSchema.field_metadata.multiline)
            scope.focusOptions.multiline = true;

          if(classSchema.data_type ==="isodate")
            scope.focusOptions.setNoFocus = true;

          return;
        })();

        /*
          Bind groupRibbon to window scroll event.
         */
        $(window).unbind('scroll.makeGroupRibbon').bind('scroll.makeGroupRibbon', _.debounce(makeGrpRibbon.bind(scope), 50));

        /*
          Call groupRibbon 1st time.
         */
        makeGrpRibbon();
        var headers = {};
        headers.application_api_key = scope.apikey;
        headers.apihost             = scope.apihost;
        headers.prefix              = scope.prefix;
        headers.authtoken           = scope.authtoken;
        if(scope.tenant)
          headers.tenant_uid = scope.tenant;  
        builtApi.Header.set(headers);

        //includes tabs for manual addition or addition through query of user in app-user-role
        
        if(scope.cls.uid === 'built_io_application_user_role'){
          var appUserRoleUsers = R.cloneDeep(scope.obj.users)
          scope.obj.users = scope.obj.users ? appUserRoleUsers : new Array()
          builtApi.Classes.getOne({
            options: {
              classUid: "built_io_application_user"
            }
          }).then(function(klass) {
            scope.appUserClass = klass;
          })
        }
        scope.appUserRoleField = {
          "display_name": "Users",
          "uid": "users",
          "data_type": "reference",
          "reference_to": "built_io_application_user",
          "field_metadata": {
            "inbuilt_field": true
          },
          "multiple": true,
          "mandatory": false
        }
    
        scope.changeUserSelectMethod = function(val){
          scope.userSelectMethod = val
          if(val === 'query'){
            scope.obj.users = appUserRoleUsers || {}
            return
          }
          scope.obj.users = appUserRoleUsers || []
        }
        scope.appUserRoleCtx = scope.obj;
        scope.intermediateQuery = []
        scope.addUserMethod = 'manual'
        scope.userAddMethod = function(e, method){
          $(".active").removeClass('active');
          $("#"+ e.currentTarget.id).attr('class', 'active');
          scope.addUserMethod = method
        }
        scope.toggleUsersExists = function(){
          scope.enableUsersInAppRole = !scope.enableUsersInAppRole
          if(!scope.enableUsersInAppRole){
            TIP.destroyAll($('.query-builder'))
          }
        }
        
        scope.getHelp = function() {
          console.log("in modal")
          Modal.openModal({}, helpModalTemplate, helpCtrl)
        }

        //Get help modal Controller
        var helpCtrl = function($scope, $modalInstance, data) {
          $scope.data = data;
          $scope.ok = function() {
            $modalInstance.close();
          };
          //Cancel Modal Selection
          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
        } 
      }
    }
  }
]