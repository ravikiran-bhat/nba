'use strict';

var configFile = require('../../../ui-config.json');

module.exports = [
  '$scope',
  '$location',
  '$timeout',
  '$state',
  'builtApi',
  'alertService',
  'utilsService',
  'passwordStrengthService',
  'vcRecaptchaService',
  'UIConfig',
  function($scope, $location, $timeout, $state, builtApi, Alert, Utils, passwordStrength,vcRecaptchaService,UIConfig) {
    var btnSubmit       = $('#signup-form .btn-signup');
    var searchQuery     = Utils.queryDecoder(window.location.search) || undefined;
    $scope.allowCaptcha = configFile.defaults.settings.enableGooglerecaptcha;
    $scope.inputElems   = $(':input[required]:visible');
    $scope.userData     = {};
    $scope.disabled     = true;
    $scope.loadingState = true;
    $scope.btnLabel   = {
      loading : UIConfig.restricted_registration ? 'Creating...' : 'Signing up...',
      normal  : UIConfig.restricted_registration ? 'Create Account' : 'Start building killer apps!'
    };

    $scope.setRecaptchaId = function(widgetId) {
     $scope.recaptchaId = widgetId;
    };

    $('[data-toggle="popover"]').popover({
      html: true,
      container:'.password-section'
    })


    function updateUserData(){
      if (searchQuery) {
        if (searchQuery.email){
          $scope.userData['email'] = searchQuery.email;
        }

        if (searchQuery.referral)
          $scope.userData['promo_code'] = searchQuery.referral;
      }
    }
    
    if(UIConfig.restricted_registration){
      checkUserRestriction()
    } else{
      $scope.loadingState = false;
      updateUserData()
    }
    
    function redirectToSignIn(){
      $state.transitionTo('app.auth.signin');
    }

    function checkUserRestriction(){
      if(searchQuery && searchQuery.email){
        builtApi.UserSession.checkUserRestriction({
          options: {
            params: {
              email: searchQuery.email
            }
          }
        })
        .then(function(data){
          $scope.loadingState = false;
          if(data.isPermitted){
            $scope.userData = $scope.userData ? $scope.userData : {}
            updateUserData()
          }else {
            redirectToSignIn();
          }
        },function(){
          redirectToSignIn();
        })
      } else{
        redirectToSignIn();
      }
    }

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

    function matchPswd(){
      return ($scope.userData.password === $scope.userData.password_confirmation)         
    }

    //console.log(searchQuery);
    $scope.createAccount = function() {
      btnSubmit.button('loading');
      $('#divSmallBoxes').empty();

      if (searchQuery) {
        var source = searchQuery.blt_source || searchQuery.utm_campaign;

        if ($.trim(source))
          $scope.userData['source'] = source;

        if (searchQuery.plan_id)
          $scope.userData['plan_id'] = searchQuery.plan_id;

        if (!$scope.termAgreement) {
          Alert.notify({
            title: "Terms and conditions agreement",
            content: "In order to use built.io, you must agree to the terms of service and privacy policy.",
            type: 'error'
          });
          if($scope.allowCaptcha === true) {
            vcRecaptchaService.reload($scope.recaptchaId)
          }
          btnSubmit.button('reset');
          return false;
        }

        if($scope.allowCaptcha === true) {
          if(vcRecaptchaService && vcRecaptchaService.getResponse($scope.recaptchaId).length > 0 == false) {
            Alert.notify({
              title: "Your registration has failed. Please try again!",
              content: "Please fill the captcha",
              type: 'error'
            });
            btnSubmit.button('reset');
            return false;
          }
        }

        if(!($scope.strength === 'Strong')) {
          Alert.notify({
           title: "Your registration has failed. Please try again!",
           content: "password should be 8 to 16 characters, including at least one upper case, lower case, number, and special character.",
           type: 'error'
          });
          btnSubmit.button('reset');
          if($scope.allowCaptcha === true) {
            vcRecaptchaService.reload($scope.recaptchaId)
          }
          return false;
        }

        var params = {
          "body": {
            "user": $scope.userData
          }
        };

        builtApi.SystemUserSession.signUp(params)
          .then(function(res) {
            var userData  = _.cloneDeep(res.user);
            delete userData.roles;
            delete userData.authtoken;
            EVENTS.trigger($scope, 'USER.SIGNUP.SUCCESS', userData);
            $state.go('app.auth.signin');
            setTimeout(function() {
              Alert.notify({
                title: "Success",
                content: res.notice,
                type: 'success'
              })
            }, 1000);


          }, function(xhr) {
            if($scope.allowCaptcha === true) {
              vcRecaptchaService.reload($scope.recaptchaId)
            }
            EVENTS.trigger($scope, 'USER.SIGNUP.ERROR', xhr);
            Alert.notify({
              title: xhr.entity.error_message,
              content: Utils.parseError(xhr.entity),
              type: 'error'
            });
          })
          .finally(function() {
            btnSubmit.button('reset');
          });
      }
    }

   /* $timeout(function(){
      $scope.userData = undefined;
    });*/
    
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