var builtApi = require('./services/built-api.js');

module.exports = angular.module('builtApi', [])
  .service('builtApi', builtApi);