'use strict';
var angular           = require('third-party-modules/angular');
var uiRouter          = require('third-party-modules/angular-ui-router');

var menu   				= require('./directives/menu.js');
var menuProvider  = require('./providers/menu-service.js');  

module.exports = angular.module('built.menu', [])
.directive('sideMenu', menu)
.service('menuService', menuProvider)