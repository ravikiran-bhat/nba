'use strict';

var configFile     = require('../../../ui-config.json');

module.exports = [
  '$scope',
  '$state',
  'builtApi',
  'appCacheService',
  'alertService',
  'utilsService',
  'modalService',
  'vcRecaptchaService',
  function($scope, $state, builtApi, appCacheService, Alert, Utils, Modal, vcRecaptchaService) {
    var btnSubmit        = $('#forgot-password-form .btn-submit');
    $scope.allowCaptcha  = configFile.defaults.settings.enableGooglerecaptcha;

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
        vcRecaptchaService.reload($scope.recaptcha.widgetId);
      }
    };
    $scope.sendRequest = function() {
      btnSubmit.button('loading');
      if($scope.allowCaptcha === true) {
        if(vcRecaptchaService && (vcRecaptchaService.getResponse($scope.recaptchaId).length > 0 == false)) {
          Alert.notify({
            title: "Your request for resetting password has failed. Please try again!",
            content: "Please fill the captcha",
            type: 'error'
          });
          btnSubmit.button('reset');
          return false;
        }
      }
      builtApi.UserSession.postForgotPassword({
          body: {
            user: $scope.data
          }
        })
        .then(function(res) {
          $state.go('app.auth.signin');
          
          Alert.notify({
            title: 'Success',
            content: res.notice,
            type: 'success'
          });

          
        }, function(xhr) {
          if($scope.allowCaptcha === true) {
            console.log("entered in frgt password")
            // setTimeout(function(){
              // $scope.recaptcha.reset($scope.recaptcha.widgetId);
              vcRecaptchaService.reload($scope.recaptchaId);
            // },10)
          }
          Alert.notify({
            title: xhr.entity.error_message,
            content: Utils.parseError(xhr.entity),
            type: 'error'
          });
        })
        .finally(function() {
          btnSubmit.button('reset');
        })
    }
  }
]