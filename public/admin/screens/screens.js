'use strict';

//Dependent Modules
var angular 									= require('third-party-modules/angular');
var uiRouter 									= require('third-party-modules/angular-ui-router');

//Controllers
var myAccountCtrl 						= require('./controllers/screen-ctrl');

//Templates
var accountTemplate 					= require('./controllers/partials/screen.html');

module.exports = angular.module('built.account', ['ui.router'])
	.controller('myAccountCtrl', myAccountCtrl)
	.config([
		'$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('app.account', {
					url: '/screen',
					controller: 'myAccountCtrl',
					template: accountTemplate
				})
		}
	])