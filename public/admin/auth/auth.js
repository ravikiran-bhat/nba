//Third Party Modules
var angular                = require('third-party-modules/angular');
var uiRouter               = require('third-party-modules/angular-ui-router');

//Controllers
var signinCtrl             = require('./controllers/signin-ctrl');

var authCtrl               = require('./controllers/auth-ctrl');
//var scheduleCtrl           = require('./controllers/schedule-ctrl');
var signupCtrl             = require('./controllers/signup-ctrl');
var resetPasswordCtrl      = require('./controllers/reset-password-ctrl');
var forgotPasswordCtrl     = require('./controllers/forgot-password-ctrl');
var appActivationCtrl      = require('./controllers/app-activation-ctrl');


//Templates
var authTemplate           = require('./partials/auth.html');

var signinTemplate         = require('./partials/signin.html');
var signupTemplate         = require('./partials/signup.html');
//var scheduleTemplate       = require('./partials/schedule.html');
var resetPasswordTemplate  = require('./partials/reset-password.html');
var forgotPasswordTemplate = require('./partials/forgot-password.html');
var appActivationTemplate  = require('./partials/app-activation.html');


module.exports = angular.module('built.auth', [uiRouter])

  .controller('authCtrl', authCtrl)
  .controller('signinCtrl', signinCtrl)
  .controller('resetPasswordCtrl', resetPasswordCtrl)
  .controller('forgotPasswordCtrl', forgotPasswordCtrl)
  .controller('appActivationCtrl', appActivationCtrl)
  .controller('signupCtrl',signupCtrl)
  .config([
    '$stateProvider','$urlRouterProvider',
    function($stateProvider,$urlRouterProvider) {
      $stateProvider
        .state('app.auth', {
          url: '/',
          template: authTemplate,
          abstract: true,
          data: {
            extraPage: true,
            layout: {
              leftMenu: false
            }
          }
        })        
        .state('app.auth.signin', {
          url: 'signin',
          template: signinTemplate,
          resolvers: ['UIConfig'],
          controller: 'signinCtrl',
          data: {
            extraPage: true,
            layout: {
              leftMenu: false
            }
          }

        })        
        .state('app.auth.signup', {
          url: 'signup',
          template: signupTemplate,
          controller: 'signupCtrl',
          resolvers: ['UIConfig'],
          data: {
            extraPage: true,
            layout: {
              leftMenu: false
            }
          }
        })
        .state('app.auth.systemResetPassword', {
          url: 'user/reset_password_submit/:authtoken',
          template: resetPasswordTemplate,
          controller: 'resetPasswordCtrl',
          data: {
            extraPage: true,
            layout: {
              leftMenu: false
            }
          }
        })
        .state('app.auth.systemForgotPassword', {
          url: 'user/retrieve-password',
          template: forgotPasswordTemplate,
          controller: 'forgotPasswordCtrl',
          data: {
            appUser: true,
            extraPage: true,
            layout: {
              leftMenu: false
            }
          }
        })
        .state('app.auth.appUserResetPassword', {
          url: 'application/:appUid/users/reset_password/:authtoken',
          template: resetPasswordTemplate,
          controller: 'resetPasswordCtrl',
          data: {
            appUser: true,
            extraPage: true,
            layout: {
              leftMenu: false
            }
          }
        })
        .state('app.auth.tenantAppUserResetPassword', {
          url: 'application/:appUid/users/reset_password/:authtoken/tenant_uid/:tenantUid',
          template: resetPasswordTemplate,
          controller: 'resetPasswordCtrl',
          data: {
            appUser: true,
            extraPage: true,
            layout: {
              leftMenu: false
            }
          }
        })
        .state('app.auth.systemUserActivations', {
          url: 'activations/:authtoken',
          template: appActivationTemplate,
          controller: 'appActivationCtrl',
          data: {
            extraPage: true,
            layout: {
              leftMenu: false
            }
          }
        })
        .state('app.auth.appUserActivations', {
          url: 'application/:appUid/users/:appUserUid/activate/:authtoken',
          template: appActivationTemplate,
          controller: 'appActivationCtrl',
          data: {
            appUser: true,
            extraPage: true,
            layout: {
              leftMenu: false
            }
          }
        })
        .state('app.auth.tenantAppUserActivations', {
          url: 'application/:appUid/users/:appUserUid/activate/:authtoken/tenant_uid/:tenantUid',
          template: appActivationTemplate,
          controller: 'appActivationCtrl',
          data: {
            appUser: true,
            extraPage: true,
            layout: {
              leftMenu: false
            }
          }
        });
    }
  ]);
