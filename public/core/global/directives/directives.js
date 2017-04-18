'use strict';

// EXCLUDE GO HERE
var bootstrapDaterangepicker = require('./types/bootstrap-daterangepicker');
var bootstrapDatePicker      = require('./types/bootstrap-date-picker');
var breadcrumbs              = require('./types/breadcrumbs');
var appSelectBox             = require('./types/app-select-box');  
var focusOnInput             = require('./types/focus-on-input');
var indeterminateCheckbox    = require('./types/indeterminate-checkbox');  

var addButton                = require('./types/add-button');
var optionalActions          = require('./types/optional-actions'); 
// EXCLUDE END HERE
var searchEntity             = require('./types/search-entity');
var btnLoader                = require('./types/btn-loader');

module.exports = angular.module('global-directives', [])
.directive('btnLoader', btnLoader)
.directive('searchEntity', searchEntity)
// EXCLUDE GO HERE
.directive('bootstrapDatePicker', bootstrapDatePicker)
.directive('bootstrapDaterangepicker', bootstrapDaterangepicker)
.directive('appselectbox', appSelectBox)
.directive('breadcrumbs', breadcrumbs)
.directive('focusOnInput', focusOnInput)
.directive('addButton', addButton)
.directive('optionalActions', optionalActions)
.directive('indeterminateCheckbox', indeterminateCheckbox)
// EXCLUDE END HERE
