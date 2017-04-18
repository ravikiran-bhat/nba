'use strict';
var forgotPassword = require('../partials/forgot-password.html');
var configFile     = require('../../../ui-config.json');

module.exports = [
  '$scope',
  '$state',
  'builtApi',
  'appCacheService',
  'alertService',
  'utilsService',
  'modalService',
  '$timeout',
  '$q',
  'relayService',
  'vcRecaptchaService',
  'UIConfig',
  function($scope, $state, builtApi, appCacheService, Alert, Utils, Modal, $timeout, $q, Relay, vcRecaptchaService,UIConfig) {
    
    var btnSubmit                  = $('#login-form .btn-submit');
    $scope.resReg                  = UIConfig.restricted_registration;
    $scope.loadingState            = true;
    $scope.allowCaptcha            = configFile.defaults.settings.enableGooglerecaptcha;
    $scope.maximumLoginAttempts    = configFile.defaults.settings.maximumLoginAttempts;
    $scope.enableCaptcha           = false;
    $scope.errorCount              = localStorage.getItem('maximumLoginAttempts') || 0;
    btnSubmit.button('loading...');

    $scope.setRecaptchaId = function(widgetId) {
     $scope.recaptchaId = widgetId;
    };

    $scope.recaptcha = {
      key: "6Le1Hw4UAAAAAHpMRQh9WV4z10gVdcbFDfPhdOpb",
      widgetId: null,
      response: null,
      setWidget: function(widgetId) { $scope.recaptcha.widgetId = widgetId; },
      setResponse: function(response) { $scope.recaptcha.response = response; $scope.canSubmit = true;},
      cbEpxiration: function() { $scope.recaptcha.response = null; },
      reset: function () {
        $scope.recaptcha.response = null;
        vcRecaptchaService ? vcRecaptchaService.reload($scope.recaptcha.widgetId) : '';
      }
    };

    appCacheService.then('currentUser', builtApi.UserSession.get())
      .then(function(result) {
        $state.transitionTo('app.applications.listboard');
      }, function(error) {

      })
      .finally(function() {
        btnSubmit.button('reset');
        $scope.loadingState = false;
      });

    function checkCredentialsInSafari() {
      var is_safari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
      $("form").submit(function(e) {
        var ref = $(this).find("[required]");
        $(ref).each(function(){
          $scope.formElems = $(this).val();
          if ($(this).val() == '' && is_safari)
          {
            Alert.notify({
              title: "Whoops,Something is wrong,may be you didn't not fill the form",
              content: "Please fill the form properly",
              type: 'error'
            });
            $(this).focus();
            e.preventDefault();
            btnSubmit.button('reset');
            return false;
          }
        });
        return true;
      });
    }

    checkCredentialsInSafari();

    $scope.login = function(credentials) {
      btnSubmit.button('loading');
      if(credentials !== undefined) {
        var params = {
          "body": {
            "user": {
              "email": credentials.email,
              "password": credentials.password
            }
          }
        };
        if($scope.allowCaptcha === true && $scope.enableCaptcha === true && $scope.formElems !== '') {
          if(vcRecaptchaService && (vcRecaptchaService.getResponse($scope.recaptchaId).length > 0 == false)) {
            Alert.notify({
              title: "Your registration has failed. Please try again!",
              content: "Please fill the captcha",
              type: 'error'
            });
            btnSubmit.button('reset');
            return false;
          }
        }
        builtApi.UserSession.login(params)
          .then(function(data) {
            var userData  = _.cloneDeep(data.user);
            appCacheService.set('currentUser', data.user);
            $timeout(function(){
              Relay.send('currentUser', data.user);
            }, 0);
            delete userData.roles;
            delete userData.authtoken;
            $scope.errorCount = 0;
            localStorage.removeItem("maximumLoginAttempts");
            $state.transitionTo('app.applications.listboard');
          }, function(xhr) {
            /*A condition to check maximnum login attempts to show google Captcha*/
            $scope.errorCount = JSON.parse($scope.errorCount) + 1;
            localStorage.setItem('maximumLoginAttempts',$scope.errorCount)
            if($scope.errorCount >= $scope.maximumLoginAttempts) {
              $scope.enableCaptcha = true;
            }
            if($scope.enableCaptcha === true && vcRecaptchaService && $scope.formElems !== '') {
              setTimeout(function(){
               vcRecaptchaService.reload($scope.recaptchaId)
              },10)
            }
            btnSubmit.button('reset');
            if($scope.formElems !== '')
            Alert.notify({
              title: xhr.entity.error_message,
              content: Utils.parseError(xhr.entity),
              type: 'error'
            });
          });        
      }
      else {
        btnSubmit.button('reset');
      }
    }

    $scope.checkMaximumPasswordAttempts = function() {
      if((localStorage.getItem("maximumLoginAttempts") !== null) && (JSON.parse(localStorage.getItem('maximumLoginAttempts')) >= $scope.maximumLoginAttempts)) {
        $scope.enableCaptcha = true;
      }
    }

    $scope.checkMaximumPasswordAttempts();   

    $scope.scheduleDemo = function(){
      $state.go("app.auth.schedule");
    }

    $scope.showResetPasswordModal = function() {

      Modal.openModal({
          email: ""
        }, forgotPassword, ModalInstanceCtrl, {
          size: 'sm'
        })
        .then(function(res) {

          builtApi.UserSession.postForgotPassword({
            body: {
              user: res
            }
          }).then(function(res) {
            Alert.notify({
              title: 'Success',
              content: res.notice,
              type: 'success'
            });

          }, function(xhr) {
            Alert.notify({
              title: xhr.entity.error_message,
              content: Utils.parseError(xhr.entity),
              type: 'error'
            });
          })

        })

      return false;

    }

    var ModalInstanceCtrl = function($scope, $modalInstance, data) {

      $scope.data = data;
      $scope.ok = function() {
        $modalInstance.close($scope.data);
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    }

    $timeout(function(){
      $scope.credentials = undefined;
    });
    
  }
]