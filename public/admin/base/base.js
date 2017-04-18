'use strict';

var angular      = require('third-party-modules/angular');
var uiRouter     = require('angular-ui-router');

var resolvers    = require('../resolvers');
var baseCtrl     = require('./controllers/base-ctrl');
var baseTemplate = require('./partials/base.html');

module.exports = angular.module('built.base', ['ui.router'])
	.controller('baseCtrl', baseCtrl)
	.config([
		'$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('app', {
					template: baseTemplate,
					resolve: resolvers.resolve(['currentHostConfig','UIConfig','plans']),
					controller: 'baseCtrl'
				})
		}
	])