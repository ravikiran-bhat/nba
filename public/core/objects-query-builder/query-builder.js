'use strict';

// CSS GO HERE

// CSS END HERE

// Include Modules
require('third-party-modules/select2');
require('third-party-modules/qtip');
_             = require('third-party-modules/lodash');
R             = require('third-party-modules/ramda');
moment        = require('third-party-modules/moment');

// Directives
var queryBuilder      = require('./directives/query-builder');
var parentgroupview   = require('./directives/parent-group-view');
var groupview         = require('./directives/group-view');
var rowview           = require('./directives/row-view');

var stringRuleView    = require('./directives/rules/string-rule-view');
var isoDateRuleView   = require('./directives/rules/isodate-rule-view');
var numberRuleView    = require('./directives/rules/number-rule-view');
var booleanRuleView   = require('./directives/rules/boolean-rule-view');
var selectRuleView    = require('./directives/rules/select-rule-view');

// Services
var utils             = require('./services/query-builder.js');
var builtDataService  = require('./services/built-data-service'); 


module.exports = angular.module('objectsQueryBuilder', [])
  .directive('objectsQueryBuilder', queryBuilder)
  .directive('parentGroupView', parentgroupview)
  .directive('oqGroupView', groupview)
  .directive('oqRowView', rowview)
  .directive('oqStringRuleView', stringRuleView)
  .directive('oqIsodateRuleView', isoDateRuleView)
  .directive('oqNumberRuleView', numberRuleView)
  .directive('oqBooleanRuleView', booleanRuleView)
  .directive('oqSelectRuleView', selectRuleView)
  // DIRECTIVE GO HERE

  // DIRECTIVE END HERE
  .service('oqService', utils)
  .service('oqBuiltDataService', builtDataService)
  // SERVICES GO HERE

  // SERVICES END HERE