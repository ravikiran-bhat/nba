//updating browser manifest/appcache that is already present
try{
	window.applicationCache.update();
}catch(e){
	//console.log(e);
}



_                  = require('third-party-modules/lodash');
R                  = require('third-party-modules/ramda');
moment             = require('third-party-modules/moment');

var angular        = require('third-party-modules/angular');
var uiRouter       = require('angular-ui-router');

require('angular-recaptcha');
require('third-party-modules/angular-tr-ng-grid');
require('third-party-modules/pace');
require('third-party-modules/footable');


/**
 * Default Modules
*/


var base    = require('./base/base');
var auth    = require('./auth/auth');
var core    = require('../core/core');
var global  = require('./global/global');
var account = require('./account/account');
var menu    = require('./menu/menu');
var screens = require('./screens/screens');


// PLUGINS END HERE

var baseModules = [
	uiRouter,
	core.name,
	global.name,
	menu.name,
	base.name,
	auth.name,
	account.name,
	screens.name,
  'vcRecaptcha'	
];

/**
 * Initialize manage angular module
 */
angular.module('notifications', baseModules)
	.config([
		'$stateProvider',
		'$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider
				.otherwise('/screen')
				.when('/signup', '/signup/')
				.when('/signin', '/signin/')
		}
	])
	.run(['$rootScope',
		'relayService',
		'utilsService',
		'$state',
		'appCacheService',
		'alertService',
		'$q',
		'builtApi',
		'previousStateService',
		'manageUtils',
		'$location',
		function($rootScope, Relay, Utils, $state, appCacheService, Alert, $q, builtApi, previousStateService, manageUtils, $location) {
			appCacheService.removeAll();
			$rootScope.productName = "Built.io Push Notification";
			//convert seconds to milliseconds
			var infoMessageFlag    = false;
			var warningMessageFlag = false;
			var timer;
			var h                  = $('html');
			h.addClass('its-' + Utils.getOS());

			if (document.createElement("input").placeholder == undefined) {
				h.addClass('no-placeholder-support');
			}

			/* Small script for clickjacking */
			if (self == top) {
			  var theBody = document.getElementsByTagName('body')[0]
			  theBody.style.display = "block"
			} else {
			  top.location = self.location 
		  }

			/**
        Initialize Smart Admin
      */
			setTimeout(function() {
				h.addClass('app-loaded');
				pageSetUp();
				initApp.addDeviceType();
				initApp.menuPos();
				initApp.domReadyMisc();
				initApp.SmartActions();
			}, 400);

      $(window).resize(function() {
        if(isAuthPage($state.current.name)) {
          adjustAuthPageContentPosition();
        }
      });

			$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

				//console.log("tostate", toState)
				console.log("fromState", event, toState, toParams, fromState, fromParams, error)
				
				if (Utils.getPath(error, 'status.code') === 401) {
					$state.go('app.auth.signin')
					return;
				}

				Alert.notify({
					title: Utils.getPath(error, 'entity.error_message') || "Something went wrong!",
					content: error.entity ? Utils.parseError(error.entity) : error.message,
					type: 'error',
					delay: 30000
				});
			});

			$rootScope.$on('$stateChangeStart', function(event, next, toParams, fromState, fromParams) {
				/**
				 * Clear cached data when route changes.
				 */

				switch (next.name) {
					case 'app.auth.signin':
						appCacheService.remove('apps','currentApp', 'currentUser', 'currentAccount');
						break;

					case 'app.applications.listboard':
						appCacheService.remove('apps', 'currentApp');
						manageUtils.cache.clearAppHeaderKeys();
						manageUtils.cache.clearAppRelatedCache();
						break;

					case 'app.applications.dashboard.classes-list':
						appCacheService.remove('currentObject');
						break;

					case 'app.applications.dashboard.classes-objects-list':
					case 'app.applications.dashboard.classes-objects-list.all':
						appCacheService.remove('currentObject');
						break;
				}

				if(next.name === 'app.auth.signin' && $rootScope.loggedIn === true){
	        event.preventDefault();
	        $state.go('app.applications.listboard');
	      }
			});

			$rootScope.$on('$stateChangeSuccess', function(event, next, toParams, fromState, fromParams) {
				
				previousStateService.set(fromState.name, fromParams);
				showInitialMessages();

				/**
          Always scroll to top on page change.
        */
				Utils.scrollTo(0, $('html, body'));
				$('body').removeClass('nooverflow');
				$('#divSmallBoxes').empty();

				/**
          Add a class to html if the page is an extra page.
        */
				if (!_.isUndefined(Utils.getPath(next['data'], 'extraPage'))) {
					h.attr('id', 'extr-page').removeClass('hidden-menu-mobile-lock');
				} else {
					h.removeAttr('id');
				}

				/**
          Add a class to html if left menu is false.
        */
      
				if (!_.isUndefined(Utils.getPath(next['data'], 'layout.leftMenu')) && next['data']['layout']['leftMenu'] === false) {
					h.addClass('no-left-menu');
				} else {
					h.removeClass('no-left-menu');
				}

				if(isAuthPage(next.name)) {
					adjustAuthPageContentPosition();
				}
			});

			//extend Angular's scope allowing you to remove listeners
			Relay.extendRootScope();
			

			function isAuthPage(name) {
				return name.indexOf('app.auth') != -1;
			}

			function adjustAuthPageContentPosition() {
				return _.debounce(function() {
  				var vh           = $(window).height();
          var content      = $('.auth-wrap .a-content');
          var view         = $('.auth-wrap .a-view');
          var headerHeight = window.innerWidth < 768 ? ( ($('#header').height() + 2) / 2 ) : 0; // Where 2 is border of header (jQuery does not include this in its height calculation).
          var contentTop   = ((vh - content.height()) / 2) + headerHeight; // Calculate marginTop to center content.
          var viewTop      = ((vh - view.height())    / 2) + headerHeight; // Calculate marginTop to center view.
          var threshold    = 50 + headerHeight;

  				content.css({'margin-top':  contentTop < threshold ? threshold : contentTop + 'px'});
  				view.css({'margin-top'   :  viewTop    < threshold ? threshold : viewTop    + 'px'});

        }, 50)();
			}



			function showInitialMessages() {
				//Set Information Message on  state change
				if (!_.isEmpty(appCacheService.get('currentAccount'))) {
					var InfoMsg = appCacheService.get('currentAccount')[0].info_messages;
					if (!_.isEmpty(InfoMsg))
						if (!infoMessageFlag) {
							Utils.setInfoMessage(InfoMsg, 'info');
							infoMessageFlag = true;
						}
						//Set Warning Message on  state change
					var warningMsg = appCacheService.get('currentAccount')[0].warning_messages;
					if (!_.isEmpty(warningMsg))
						if (!warningMessageFlag) {
							Utils.setInfoMessage(warningMsg, 'warning');
							warningMessageFlag = true;
						}
				}

			}
		}
	]);