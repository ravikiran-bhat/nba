'use strict';

module.exports = function(){
  function getFromAppCache(requestedUid, cachedObj){
    if(requestedUid !== cachedObj.uid){
      return false
    }
    return true;
  }
  var resolverEntity ={
    currentHostConfig: [
      'appCacheService',
      'builtApi',
      function(appCacheService, builtApi) {
        return appCacheService.get('currentHostConfig') || appCacheService.then('currentHostConfig', builtApi.HostConfig.getHostConfig());
      }
    ],
    serverConfig: [
      'appCacheService',
      'builtApi',
      function(appCacheService, builtApi) {
        return appCacheService.get('serverConfig') || appCacheService.then('serverConfig', builtApi.ServerConfig.getServerConfig());
      }
    ],
    UIConfig: [
      'appCacheService',
      'builtApi',
      function(appCacheService, builtApi) {
        console.log("in resolved")
        return appCacheService.get('UIConfig') || appCacheService.then('UIConfig', builtApi.UIConfig.getUIConfig());
      }
    ],
    currentUser: [
      'appCacheService',
      'builtApi',
      function(appCacheService, builtApi) {
        return appCacheService.get('currentUser') || appCacheService.then('currentUser', builtApi.UserSession.get());
      }
    ],

    /*
      Accounts
    */
    accounts: [
      'appCacheService',
      'builtApi',
      function(appCacheService, builtApi) {
        return appCacheService.get('currentAccount') || appCacheService.then('currentAccount', builtApi.Accounts.getAccounts());
      }
    ],

    /*
      Applications
    */
    apps: [
      'appCacheService',
      'builtApi',
      function(appCacheService, builtApi) {
        var params = {
          options: {
            query: {
              desc: 'created_at'
            }
          }
        }
        return appCacheService.get('apps') || appCacheService.then('apps', builtApi.Application.getApps(params));
      }
    ],
    appsFromServer: [
      'builtApi',
      function(builtApi) {
        var params = {
          options: {
            query: {
              desc: 'created_at'
            }
          }
        }
        return builtApi.Application.getApps(params);
      }
    ],
    currentApp: [
      'appCacheService',
      'builtApi',
      '$stateParams',
      'utilsService',
      'manageUtils',
      function(appCacheService, builtApi, $stateParams, Utils, manageUtils) {
        builtApi.setHeaders({
          application_api_key: $stateParams.api_key
        });

        var apps  = appCacheService.get('apps') || [];
        var app = appCacheService.get('currentApp') || apps.filter(function(app){return app.api_key === $stateParams.api_key;})[0];

        if (app){
          manageUtils.setAppHeaders(app);
          appCacheService.set('currentApp', app);
          return app;
        }

        var promise = appCacheService.then('currentApp', builtApi.Application.getApp());
        return promise.then(function(data) {
          manageUtils.setAppHeaders(data);
          //console.log("git data after aync", data);
          return data;
        });

      }
    ],
    permissions: [
      'builtApi',
      'appCacheService',
      '$stateParams',
      'currentUser',
      'currentApp',
      'can',
      '$q',
      'constants',
      function(builtApi, appCacheService, $stateParams, currentUser, currentApp, CAN, $q, constants) {
        // Check if permissions need to be obtained for the current logged in user.
        if(CAN.needPermissions) {
          var params = {
            options: {
              query: {
                'users[]' : currentUser.uid
              }
            }
          };
          return appCacheService.get('currentClass') || appCacheService.then('permissions', builtApi.Application.Collaborators.getPermissions(params));
        } else {
          // Return a resolved promise if no permissions are required.
          return $q.when([{}]);
        }
      }
    ],
 
    currentFieldTypes: [
      'builtApi',
      'appCacheService',
      '$stateParams',
      function(builtApi, appCacheService, $stateParams) {
        return appCacheService.get('currentFieldTypes') || appCacheService.then('currentFieldTypes', builtApi.FieldTypes.getDataTypes());
      }
    ],

    /*
      Decvices
    */
    currentDevice: [
      'appCacheService',
      'builtApi',
      '$stateParams',
      'currentApp',
      function(appCacheService, builtApi, $stateParams, currentApp) {
        var params = {
          options: {
            deviceUid: $stateParams.obj_uid,
            query: {
              'include_unpublished': true
            }
          }
        }
        return appCacheService.get('currentDevice') || appCacheService.then('currentDevice', builtApi.Devices.getDevice(params));
      }
    ],
    currentDeviceFromServer: [
      'builtApi',
      '$stateParams',
      'currentApp',
      function(builtApi, $stateParams, currentApp) {
        var params = {
          options: {
            classUid: $stateParams.class_uid,
            deviceUid: $stateParams.obj_uid,
            query: {
              'include_unpublished': true
            }
          }
        }
        return builtApi.Devices.getDevice(params);
      }
    ],
    deviceClass: [
      'builtApi',
      'appCacheService',
      '$stateParams',
      function(builtApi, appCacheService, $stateParams) {
        var params = {}
        return appCacheService.get('deviceClass') || appCacheService.then('deviceClass', builtApi.Devices.getDevicesClass(params));
      }
    ],
    /*
      Groups
    */
    groups: [
      'builtApi',
      'appCacheService',
      '$stateParams',
      function(builtApi, appCacheService, $stateParams) {
        var params = {}
        return appCacheService.get('groups') || appCacheService.then('groups', builtApi.Groups.getAll(params));
      }
    ],
    /*
      Application metrics
    */
    applicationApiMetrics: [
      'appCacheService',
      'builtApi',
      function(appCacheService, builtApi) {
        return appCacheService.then('applicationApiMetrics', builtApi.ApiMetrics.get({
          options: {
            metricsType: 'application_api_metrics',
          }
        }));
      }
    ],

    /*
      Integration
    */
    integration: [
      'appCacheService',
      'builtApi',
      function(appCacheService, builtApi) {
        return appCacheService.get('integration') || appCacheService.then('integration', builtApi.Integration.get());
      }
    ],

    /*
      Notifications
    */
    notificationCredentials: [
      'appCacheService',
      'builtApi',
      function(appCacheService, builtApi) {
        return appCacheService.get('notificationCredentials') || appCacheService.then('notificationCredentials', builtApi.Notifications.getCredentialsDetails());
      }
    ],

    /*
      Extensions
    */
    ccLogs: [
      'builtApi',
      '$stateParams',
      function(builtApi, $stateParams) {
        return builtApi.Extensions.get({
          options: {
            paramId: 'logs',
            query: {
              app_api_key: $stateParams.api_key
            }
          }
        });
      }
    ],

    /*
      Analytics
    */
    analyticsEvents: [
      'appCacheService',
      'builtApi',
      '$stateParams',
      function(appCacheService, builtApi, $stateParams) {
        var params = {
          options: {
            query: {}
          }
        };
        return appCacheService.get('analyticsEvents') || appCacheService.then('analyticsEvents', builtApi.Analytics.getEvents(params));
      }
    ],
    segBookmarks: [
      'appCacheService',
      'builtApi',
      function(appCacheService, builtApi) {
        return appCacheService.get('segBookmarks') || appCacheService.then('segBookmarks', builtApi.Analytics.getAnalytics({
          options: {
            eventType: "analytics/segments"
          }
        }));
      }
    ],
    funnels: [
      'builtApi',
      function(builtApi) {
        return builtApi.Analytics.getAnalytics({
          options: {
            eventType: "analytics/funnels"
          }
        });
      }
    ],
    currentFunnels : [
      'appCacheService',
      'builtApi',
      '$stateParams',
      function(appCacheService, builtApi, $stateParams) {
        return builtApi.Analytics.getAnalytics({
          options: {
            eventType: "analytics/funnels/"+$stateParams.funnel_uid
          }
        });
      }
    ],
    /*
      Account settings
    */
    accountApiMetrics: [
      'appCacheService',
      'builtApi',
      function(appCacheService, builtApi) {
        return appCacheService.then('ApiMetrics', builtApi.ApiMetrics.get({
          options: {
            metricsType: 'account_api_metrics'
          }
        }));
      }
    ],
    paymentHistory: [
      'appCacheService',
      'builtApi',
      function(appCacheService, builtApi) {
        return appCacheService.then('paymentHistory', builtApi.Accounts.getPaymentHistory());
      },
    ],
    plans: [
      'appCacheService',
      'builtApi',
      function(appCacheService, builtApi) {
        return appCacheService.get('plans') || appCacheService.then('plans', builtApi.Plans.getPlans());
      },
    ],
    billingInfo: [
      'appCacheService',
      'builtApi',
      function(appCacheService, builtApi) {
        return appCacheService.then('billingInfo', builtApi.Accounts.getBillingInfo());
      },
    ],

    /*
      Application settings
    */
    appSettings: [
      'builtApi',
      function(builtApi) {
        return builtApi.Application.getAppSettings({
          options: {
            settingType: 'settings'
          }
        });
      }
    ],
    collaborators: [
      'builtApi',
      'appCacheService',
      function(builtApi, appCacheService) {
        var o = {
          options: {
            settingType: 'collaborators'
          }
        }
        return appCacheService.get('collaborators') || appCacheService.then('collaborators', builtApi.Application.getAppSettings(o));
      }
    ],
    /*
      Templates
    */
    templates: [
      'builtApi',
      function(builtApi) {
        return builtApi.Templates.getAll({
          options: {}
        });
      }
    ],
    currentTemplate: [
      'builtApi',
      'appCacheService',
      '$stateParams',
      function(builtApi, appCacheService, $stateParams) {
        return builtApi.Templates.getOne({
          options: {
            templateUid: $stateParams.template_uid
          }
        });
      }
    ],
    /*
      Messages
    */
    sentMessages: [
      'builtApi',
      function(builtApi) {
        return builtApi.Notifications.getAll({
          options: {}
        });
      }
    ]
}

  this.resolve = function(args){
    return R.pick(args)(resolverEntity);
  }

  this.$get = function(){   
    return {}
  }
}