'use strict';
var formUpload = require('../partials/file-upload.html')

module.exports = [
  '$sce',
  function($sce) {
    var iframe = '<iframe height="1" width="1" id="ACTION_TARGET" name="ACTION_TARGET" class="hidden" src=""></iframe>';
    return {
      restrict: 'A',
      transclude: true,
      scope: {
        prop      : '=prop',
        authtoken : '=authtoken',
        url       : '=url',
        apikey    : '=apikey',
        apihost   : '=apihost',
        randvalue : '=randvalue'
      },
      template: formUpload,
      link: function(scope, elem, attrs) {
        scope.host          = window.location.protocol + '//' + window.location.host;
        scope.actionTarget  = 'object-file-upload-form-iframe' + scope.randvalue;
        scope.actionurl     = $sce.trustAsResourceUrl('/v1/'+scope.url+'.postmessage?AUTHTOKEN='+scope.authtoken+'&APPLICATION_API_KEY=' + scope.apikey + '&file=true&postmessage_payload=' + scope.randvalue);
        $(elem).append(iframe.replace(/ACTION_TARGET/g, scope.actionTarget));
      }
    }
  }
]
//v1/