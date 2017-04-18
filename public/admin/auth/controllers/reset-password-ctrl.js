'use strict';

var configFile = require('../../../ui-config.json');

module.exports = [
  '$scope',
  '$location',
  '$state',
  'builtApi',
  'alertService',
  'utilsService',
  'vcRecaptchaService',
  'passwordStrengthService',
  function($scope, $location, $state, builtApi, Alert, Utils, vcRecaptchaService,passwordStrength) {
    var authtoken            = $state.params.authtoken;
    var btnSubmit            = $('#reset-form .btn-submit');
    $scope.isAppUser         = !!$state.params.appUid;
    $scope.allowCaptcha      = configFile.defaults.settings.enableGooglerecaptcha;    
    $scope.onSetPassword     = false;
    $scope.disabled          = true;    
    $scope.inputElems        = $(':input[required]:visible');
    $scope.setRecaptchaId = function(widgetId) {
     $scope.recaptchaId = widgetId;
    };
    $scope.userCredential    = {
      password: "",
      password_confirmation: "",
      reset_password_token: authtoken
    };

    $('[data-toggle="popover"]').popover({
      html: true,
      container:'.password-section'
    });

    var recaptcha = {
      key: "6Le1Hw4UAAAAAHpMRQh9WV4z10gVdcbFDfPhdOpb",
      widgetId: null,
      response: null,
      setWidget: function(widgetId) { recaptcha.widgetId = widgetId; },
      setResponse: function(response) { recaptcha.response = response; },
      cbExpiration: function() { recaptcha.response = null; },
      reset: function () {
        recaptcha.response = null;
        vcRecaptchaService.reload(recaptcha.widgetId);
      }
    };

    $scope.recaptcha = recaptcha;

    $scope.reset = function() {
      recaptcha.reset();
    };

    $scope.createCallback = function(widgetId){
      $scope.recaptcha.widgetId = widgetId;
    };

    function validatePswd() {
       //both should not be empty and both should match
      //HOTFIX for google recaptcha and will be refactored
      if($scope.allowCaptcha === true) {
        return (!_.isEmpty($scope.userCredential.password) && !_.isEmpty($scope.userCredential.password_confirmation) && (matchPswd()) &&($scope.strength === 'Strong') && (vcRecaptchaService && vcRecaptchaService.getResponse($scope.recaptchaId).length > 0))
      }
      else {
        return (!_.isEmpty($scope.userCredential.password) && !_.isEmpty($scope.userCredential.password_confirmation) && (matchPswd()) &&($scope.strength === 'Strong'))
      }
    }

    function matchPswd(){
      return ($scope.userCredential.password === $scope.userCredential.password_confirmation)         
    }

    $scope.cancel = function() {
      $state.go('app.auth.signin');
    }

    function userTypeResetPswdCall() {
      var headers = {
        application_api_key:$state.params.appUid,
      }
      if($state.params.tenantUid)
        headers['tenant_uid'] = $state.params.tenantUid
      if ($scope.isAppUser)
       return  builtApi.AppUserSession.resetPassword({
          headers: headers,
          body: {
            application_user: $scope.userCredential
          }
        })
      else
       return builtApi.UserSession.resetPassword({
          body: {
            user: $scope.userCredential
          }
        })

    }

    $scope.resetPswd = function() {
      btnSubmit.button('loading');
      if (validatePswd()){
        /*if(matchPswd()){*/
        userTypeResetPswdCall()
        .then(function(res) {
            if ($scope.isAppUser)
              $scope.onSetPassword = true;
            else
              $state.go('app.auth.signin');
            btnSubmit.button('reset');
            Alert.notify({
              title: "Success",
              content: res.notice,
              type: 'success'
            });
          },
          function(xhr) {
            if($scope.allowCaptcha === true && (vcRecaptchaService && vcRecaptchaService.getResponse($scope.recaptchaId).length > 0)) {
                vcRecaptchaService.reload($scope.recaptchaId);
            }
            btnSubmit.button('reset');
            Alert.notify({
              title: "Password reset failed",
              content: Utils.parseError(xhr.entity, []),
              type: 'error'
            });
          });
        /*}*/
        /*else{
            btnSubmit.button('reset');
            Alert.notify({
              title: "Password reset failed",
              content: "password and confirmation must match",
              type: 'error'
            });
        }*/
      }
      else if(($scope.strength === 'Strong') && (matchPswd())) {
        if(vcRecaptchaService && vcRecaptchaService.getResponse($scope.recaptchaId).length > 0 == false) {
          btnSubmit.button('reset');
          Alert.notify({
            title: "Password reset failed",
            content: "Please fill the captcha",
            type: 'error'
          });          
        }
      }
      else if(!($scope.strength === 'Strong')) {
        if($scope.allowCaptcha === true && (vcRecaptchaService && vcRecaptchaService.getResponse($scope.recaptchaId).length > 0)) {        
            vcRecaptchaService.reload($scope.recaptchaId);
        }
        btnSubmit.button('reset');
        Alert.notify({
          title: "Your registration has failed. Please try again!",
          content: "password should be 8 to 16 characters, including at least one upper case, lower case, number, and special character.",
          type: 'error'
        });
      }
      else if(!(matchPswd())){
        if($scope.allowCaptcha === true && (vcRecaptchaService && vcRecaptchaService.getResponse($scope.recaptchaId).length > 0)) {
          vcRecaptchaService.reload($scope.recaptchaId);
        }
        btnSubmit.button('reset');
        Alert.notify({
          title: "Password reset failed",
          content: "password and confirmation must match",
          type: 'error'
        });
      }
      else{
        if($scope.allowCaptcha === true && (vcRecaptchaService && vcRecaptchaService.getResponse($scope.recaptchaId).length > 0)) {        
          vcRecaptchaService.reload($scope.recaptchaId);
        }
        btnSubmit.button('reset');
        Alert.notify({
          title: "Password reset failed",
          content: "Invalid!",
          type: 'error'
        });
      }
    }

    checkPasswordStrength();

    /*Logic for testing password strength*/
    
    function checkPasswordStrength() {
      // Define variables for our input and passtrength meter
      var $passwordInput = $('.password-input-field'),
      $passtrength       = $('.passstrength-meter-wrapper');

      // Create an instance of PasstrengthMan and pass it a passtrength meter
      var pMan = new passwordStrength.PasstrengthMan( $passtrength );

      // Keyup bound on the input field
      $passwordInput.on('focus keyup', function(e) {
        var v = $(this).val();

        /*The DOM manipulation logic to show valid/invalid signs for the various combinations*/
        if(v.trim() !== '') {
          if (v.length >= 8 && v.length <=16) {
           $(".length").removeClass("invalid").addClass("valid");
          } else {
            $(".length").removeClass("valid").addClass("invalid");
          }
         
          // at least 1 digit in password
          if (v.match(/\d/)) {
            $(".num").removeClass("invalid").addClass("valid");
          } else {
            $(".num").removeClass("valid").addClass("invalid");
          }

          // at least 1 capital & lower letter in password
          if (v.match(/[A-Z]/) && v.match(/[a-z]/)) {
            $(".capital").removeClass("invalid").addClass("valid");
          } else {
            $(".capital").removeClass("valid").addClass("invalid");
          }
    
          // at least 1 special character in password {
          if (v.match(/[^\w]|[_]/)) {
            $(".spchar").removeClass("invalid").addClass("valid");
          } else {
            $(".spchar").removeClass("valid").addClass("invalid");
          }
        }
        else {
          $('.length,.spchar,.capital,.num').removeClass('invalid')
          $('.length,.spchar,.capital,.num').removeClass('valid')
        }

        // Delay and validate
        passwordStrength.DelayMan( function() {
          var strength    = pMan.validate( v );
          $scope.strength = strength
        }, 150 );
        
      });
    }
  }
]