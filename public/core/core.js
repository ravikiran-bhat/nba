'use strict';


require('./global/global');
require('./built-api/built-api');
require('./class-builder/class-builder');
require('./post-message-upload/post-message-upload');
require('./form-builder/form-builder');
require('./objects-query-builder/query-builder');
require('./app-acl/app-acl');
require('./ribbon-builder/ribbon-builder');

module.exports = angular.module('core', [
  'builtApi',
  'global',
  'classBuilder',
  'postMessageUpload',
  'formBuilder',
  'objectsQueryBuilder',
  'ribbonBuilder',
]);