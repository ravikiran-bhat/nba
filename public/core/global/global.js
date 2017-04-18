var angular = require('third-party-modules/angular');

require('third-party-modules/angular-ui-bootstrap');
require('./directives/directives');

var alerts                    = require('./services/alert');
var appCache                  = require('./services/app-cache');
var constants                 = require('./services/constants');
var utils                     = require('./services/utils');
var coreManageUtils           = require('./services/core-manage-utils');
var modal                     = require('./services/modal');
var library                   = require('./services/library');
var previousStateService      = require('./services/previous-state'); 
var tip                       = require('./services/tip.js');
var silentSearchChangeService = require('./services/ssc.js');
var prePostCalls 			        = require('./services/pre-post-calls.js');
var dataGridService           = require('./services/data-grid');
var can                       = require('./services/can');
var relay                     = require('./services/relay');
var contextMenu               = require('./services/context-menu');
var passwordStrength          = require('./services/password-strength');

module.exports = angular.module('global', ['ui.bootstrap', 'global-directives'])
	.service('alertService', alerts)
	.service('appCacheService', appCache)
	.constant('constants', constants())
  .service('utilsService', utils)
	.service('coreManageUtilsService', coreManageUtils)
	.service('modalService', modal)
  .service('previousStateService', previousStateService)
	.service('libraryService', library)
  .service('tip', tip)
  .service('can', can)
  .service('ssc', silentSearchChangeService)
  .service('dataGridService', dataGridService)
  .service('prePostCallsService', prePostCalls)
  .service('contextMenuService', contextMenu)
  .service('passwordStrengthService', passwordStrength)
  //.service('prePostCallsService', prePostCalls)
  .service('relayService', relay);