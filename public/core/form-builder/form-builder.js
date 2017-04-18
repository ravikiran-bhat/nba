
//Include Modules
//$ = jQuery    = require('third-party-modules/jquery');
//window.angular = angular   = require('third-party-modules/angular');

// CSS GO HERE
    
// CSS END HERE

//Directives
var formBuilder                    = require('./directives/form-builder');
var formField                      = require('./directives/data-types/form-field'); 
var formFieldText                  = require('./directives/data-types/form-field-text'); 
var formFieldNumber                = require('./directives/data-types/form-field-number'); 
var formFieldIsodate               = require('./directives/data-types/form-field-isodate'); 
var formFieldBoolean               = require('./directives/data-types/form-field-boolean'); 
var formFieldLink                  = require('./directives/data-types/form-field-link'); 
var formFieldGroup                 = require('./directives/data-types/form-field-group'); 
var formFieldMixed                 = require('./directives/data-types/form-field-mixed'); 
var formFieldFile                  = require('./directives/data-types/form-field-file'); 
var formFieldReference             = require('./directives/data-types/form-field-reference');
var formFieldTag                   = require('./directives/data-types/form-field-tag'); 
var formFieldLocation              = require('./directives/data-types/form-field-location');
var selectLocationSearch           = require('./directives/data-types/select-location-search'); 
var formFieldReferenceWrap         = require('./directives/data-types/form-field-reference-wrap'); 
var formFieldSelect                = require('./directives/data-types/form-field-select'); 
var formFieldPassword              = require('./directives/data-types/form-field-password'); 
var assetGallery                   = require('./directives/asset-gallery');
// var formFieldUiReferenceWrap    = require('./directives/data-types/form-field-ui-reference-wrap'); 
// var formFieldUiReference        = require('./directives/data-types/form-field-ui-reference'); 
var formbuilderUpload              = require('./directives/formbuilder-upload');  

// Services
var referenceObjectsSuggestion     = require('./services/reference-objects-suggestion'); 
//var uiReferenceObjectsSuggestion = require('./services/ui-reference-objects-suggestion'); 
var builtDataService               = require('./services/built-data-service'); 
var FormbuilderFileService         = require('./services/formbuilder-file-service');  

//Filter
var searchReferenceFilter          = require('./filters/search-reference');   

module.exports = angular.module('formBuilder', ['summernote', 'ui.bootstrap.tpls','ui.bootstrap.modal', "angular-sortable-view"])
  .directive('formbuilder', formBuilder)
  .directive('formField', formField)
  .directive('formFieldText', formFieldText)
  .directive('formFieldPassword', formFieldPassword)
  .directive('formFieldNumber', formFieldNumber)
  .directive('formFieldIsodate', formFieldIsodate)
  .directive('formFieldBoolean', formFieldBoolean)
  .directive('formFieldLink', formFieldLink)
  .directive('formFieldGroup', formFieldGroup)
  .directive('formFieldMixed', formFieldMixed)
  .directive('formFieldFile', formFieldFile)
  .directive('formFieldReference', formFieldReference)
  .directive('formFieldTag', formFieldTag)
  .directive('formFieldLocation', formFieldLocation)
  .directive('selectLocationSearch', selectLocationSearch)
  .directive('formFieldReferenceWrap', formFieldReferenceWrap)
  // .directive('formFieldUiReferenceWrap', formFieldUiReferenceWrap)
  // .directive('formFieldUiReference', formFieldUiReference)
  .directive('assetGallery', assetGallery)
  .directive('formbuilderUpload', formbuilderUpload)
  .directive('formFieldSelect', formFieldSelect)
  //.filter('searchReferenceFilter', searchReferenceFilter)
  .service('referenceObjectsSuggestionService', referenceObjectsSuggestion)
  // .service('uiReferenceObjectsSuggestionService', uiReferenceObjectsSuggestion)
  .service('fbBuiltDataService', builtDataService)
  /*.service('FormbuilderFileService', FormbuilderFileService)*/
  // SERVICES GO HERE
    
  // SERVICES END HERE
  
  // DIRECTIVES GO HERE
    
  // DIRECTIVES END HERE




//require('third-party-modules/angular-ui-bootstrap');
require('third-party-modules/angular-modal-service');
require('third-party-modules/select2');
//require('third-party-modules/jqueryui');
require('third-party-modules/as-sortable');
require('third-party-modules/summernote');
require('third-party-modules/angular-summernote');
require('third-party-modules/bootstrap-datetimepicker');
require('third-party-modules/stickykit');
require('third-party-modules/isinviewport');


_             = require('third-party-modules/lodash');
R             = require('third-party-modules/ramda');
moment        = require('third-party-modules/moment');

