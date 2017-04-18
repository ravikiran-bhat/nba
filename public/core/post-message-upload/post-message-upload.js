'use strict';
var postMessageUpload         = require('./directives/post-message-upload');
var postMessageUploadService  = require('./services/post-message-upload');

module.exports = angular.module('postMessageUpload', [])
  .directive('postFileUpload', postMessageUpload)
  .service('postMessageUploadService', postMessageUploadService);
