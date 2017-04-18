'use strict';
module.exports = [
  '$scope',
  '$location',
  '$state',
  'builtApi',
  'alertService',
  'utilsService',
  'currentUser',
  function($scope, $location, $state, builtApi, Alert, Utils, currentUser) {
    delete currentUser.username
    var btnUpdatePersonalInfo = $('.js-btn-update-info');
    $scope.user = currentUser;

    //Save User Information
    $scope.saveInformation = function(e) {        
      var button = $(e.currentTarget)
      button.button('loading');
      builtApi.UserSession.update({
        body: {
          user: $scope.user
        }
      })
        .then(function(res) {
          Alert.notify({
            title: 'Success',
            content: res.notice,
            type: 'success'
          });
        }, function(xhr) {
          xhr = xhr.entity;
          Alert.notify({
            title: xhr.error_message,
            content: Utils.parseError(xhr),
            type: 'error'
          });
        }).finally(function(){
          button.button('reset');
        });
    }
  }
]