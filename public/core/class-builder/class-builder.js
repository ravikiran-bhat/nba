
//Include Directives
var classbuilder             = require('./directives/class-builder');
var classfield               = require('./directives/class-field');
var classFieldWrap           = require('./directives/class-field-wrap');
var refSelect                = require('./directives/reference-select');
var uniqueSelect             = require('./directives/unique-select');
var classBuilderService      = require('./services/class-builder');
var knowledgeBaseService     = require('./services/class-knowledge-base');

// REQUIRE

// REQUIRE END

module.exports = angular.module('classBuilder', ['appAcl', 'ui.sortable', 'ui.bootstrap.tpls','ui.bootstrap.modal'])
  .directive('classbuilder', classbuilder)
  .directive('classfieldwrap', classFieldWrap)
  .directive('classfield', classfield)
  .directive('refselect', refSelect)
  .directive('uniqueSelect', uniqueSelect)
  .service('classBuilderService', classBuilderService)
  .service('knowledgeBaseService', knowledgeBaseService)
// SERVICES GO HERE

// SERVICES END HERE

//Include Modules
require('third-party-modules/angular-modal-service');
require('third-party-modules/jqueryui');
require('third-party-modules/angular-sortable');
_             = require('third-party-modules/lodash');
moment        = require('third-party-modules/moment');
R             = require('third-party-modules/ramda');
