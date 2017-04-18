'use strict';

// Directives
var ribbonBuilder      = require('./directives/ribbon-builder');

module.exports = angular.module('ribbonBuilder', ['global'])
  .directive('ribbonBuilder', ribbonBuilder);