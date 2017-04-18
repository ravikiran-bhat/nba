'use strict';

var configFile     = require('../../../../ui-config.json');

module.exports = [
	'$scope',
	'$location',
	'$state',
	'builtApi',
	'alertService',
	'utilsService',
	'vcRecaptchaService',
	function($scope, $location, $state, builtApi, Alert, Utils, vcRecaptchaService) {

		var btnUpdatePassword = $('.acc-form .js-btn-update-password');
		$scope.allowCaptcha   = configFile.defaults.settings.enableGooglerecaptcha;
		$scope.setRecaptchaId = function(widgetId) {
     $scope.recaptchaId = widgetId;
    };
    
    $scope.recaptcha = {
      key: "6Le1Hw4UAAAAAHpMRQh9WV4z10gVdcbFDfPhdOpb",
      widgetId: null,
      response: null,
      setWidget: function(widgetId) { $scope.recaptcha.widgetId = widgetId; },
      setResponse: function(response) { $scope.recaptcha.response = response;  $scope.canSubmit = true},            
      cbEpxiration: function() { $scope.recaptcha.response = null; },
      reset: function () {
        $scope.recaptcha.response = null;
        vcRecaptchaService.reload(recaptcha.widgetId);
      }
    };

		$scope.user = {
			"old_password": "",
			"password": "",
			"password_confirmation": ""
		}

		$scope.updatePassword = function() {
			btnUpdatePassword.button('loading');
			
			if($scope.allowCaptcha === true) {
        if(vcRecaptchaService && vcRecaptchaService.getResponse($scope.recaptchaId).length > 0 == false) {
          Alert.notify({
            title: "Password update failed. Please try again!",
            content: "Please fill the captcha",
            type: 'error'
          });
          btnUpdatePassword.button('reset');
          return false;
        }
      }

			builtApi.UserSession.update({
				body: {
					user: $scope.user
				}
			})
				.then(function(res) {
					$state.go('app.applications.listboard');
					setTimeout(function() {
						Alert.notify({
							title: 'Success',
							content: 'Woot! Password updated successfully',
							type: 'success'
						});
					}, 1000);

				}, function(xhr) {
					if($scope.allowCaptcha === true && vcRecaptchaService) {
            vcRecaptchaService.reload($scope.recaptchaId)
          }
					xhr = xhr.entity;
					Alert.notify({
						title: xhr.error_message,
						content: Utils.parseError(xhr),
						type: 'error'
					});
				}).finally(function() {
					btnUpdatePassword.button('reset');
				});
		}
	}
]