'use strict';
var menu                  = require('./services/menu');
var thirdParty            = require('./services/third-party');
var manageUtils						= require('./services/manage-utils')
var metricsWidget         = require('./directives/metrics-widget'); 
var resolvers             = require('./providers/resolvers') 
var tableTools						= require('./directives/table-tools')
var template   						= require('./directives/template')
var groups   						  = require('./directives/groups')

module.exports = angular.module('built.global', [])
.provider('resolver', resolvers)
.directive('groups', groups)
.directive('metricsWidget', metricsWidget)
.directive('tableTools', tableTools)
.directive('template', template)
.service('menuService', menu)
.service('manageUtils', manageUtils)
.service('thirdPartyService', thirdParty);
