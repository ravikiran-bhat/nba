'use strict';

//Dependent Modules
var angular 									= require('third-party-modules/angular');
var uiRouter 									= require('third-party-modules/angular-ui-router');
var resolvers 								= require('../resolvers');

//Controllers
var accountCtrl 							= require('./controllers/account/account-ctrl');
var personalInfoCtrl 					= require('./controllers/personal-info/personal-info-ctrl');
var securityCtrl 							= require('./controllers/security/security-ctrl');
var myAccountCtrl 						= require('./controllers/my-account/my-account-ctrl');

//Templates
var accountTemplate 					= require('./controllers/account/partials/account.html');
var personalInfoTemplate 			= require('./controllers/personal-info/partials/personal-info.html');
var securityTemplate 					= require('./controllers/security/partials/security.html');
var myAccountTemplate 				= require('./controllers/my-account/partials/my-account.html');

module.exports = angular.module('built.account', ['ui.router'])
	.controller('accountCtrl', accountCtrl)
	.controller('personalInfoCtrl', personalInfoCtrl)
	.controller('securityCtrl', securityCtrl)
	.controller('myAccountCtrl', myAccountCtrl)
	.config([
		'$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('app.account', {
					abstract: true,
					url: '/account',
					controller: 'accountCtrl',
					resolve: resolvers.resolve(['currentUser', 'plans']),
					template: accountTemplate
				})
				.state('app.account.personalInfo', {
					url: '/personal-info',
					controller: 'personalInfoCtrl',
					template: personalInfoTemplate,
					data: {
						layout: {
							leftMenu: false
						}
					}
				})
				.state('app.account.security', {
					url: '/security',
					controller: 'securityCtrl',
					template: securityTemplate,
					data: {
						layout: {
							leftMenu: false
						}
					}
				})
				.state('app.account.myAccount', {
					url: '/my-account',
					controller: 'myAccountCtrl',
					template: myAccountTemplate,
					data: {
						layout: {
							leftMenu: false
						}
					}
				})
				// .state('app.account.plans', {
				// 	url: '/plans',
				// 	controller: 'plansCtrl',
				// 	template: plansTemplate,
				// 	data: {
				// 		layout: {
				// 			leftMenu: false
				// 		}
				// 	}
				// })
				// .state('app.account.billingInfo', {
				// 	url: '/billing-info',
				// 	controller: 'billingInfoCtrl',
				// 	resolve: resolvers.resolve(['billingInfo']),
				// 	template: billingInfoTemplate,
				// 	data: {
				// 		layout: {
				// 			leftMenu: false
				// 		}
				// 	}
				// })
				// .state('app.account.purchaseHistory', {
				// 	url: '/purchase-history',
				// 	controller: 'purchaseHistoryCtrl',
				// 	resolve: resolvers.resolve(['paymentHistory']),
				// 	template: purchaseHistoryTemplate,
				// 	data: {
				// 		layout: {
				// 			leftMenu: false
				// 		}
				// 	}
				// })
				// .state('app.account.metrics', {
				// 	url: '/metrics',
				// 	controller: 'metricsCtrl',
				// 	resolve: resolvers.resolve(['accountApiMetrics']),
				// 	template: metricsTemplate,
				// 	data: {
				// 		layout: {
				// 			leftMenu: false
				// 		}
				// 	}
				// })
		}
	])