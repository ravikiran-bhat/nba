'use strict';

module.exports = [
  '$scope',
  '$location',
  '$state',
  'builtApi',
  'alertService',
  'utilsService',
  function($scope, $location, $state, builtApi, Alert, Utils) {
    var appUserUid = $state.params.appUserUid;
    var authtoken = $state.params.authtoken;
    var isAppUser = !!$state.params.appUid;

    $scope.activationStatus = "checking";

    function userTypeAppActivationCall() {
      var headers = {
        application_api_key:$state.params.appUid,
      }
      if($state.params.tenantUid)
        headers['tenant_uid'] = $state.params.tenantUid

      return builtApi.UserSession.activateAccount({
          options: {
            authtoken: authtoken
          }
        })
    }

    userTypeAppActivationCall()
      .then(function(res) {
        if (isAppUser)
          $scope.activationStatus = "success";
        else
          $state.go('app.auth.signin');

        Alert.notify({
          title: "Success",
          content: res.notice,
          type: 'success'
        })
      }, function(xhr) {
        $scope.activationStatus = "fail";
        Alert.notify({
          title: "Activation failed",
          content: xhr.entity.error_message,
          type: 'error'
        });
      })
  }
]