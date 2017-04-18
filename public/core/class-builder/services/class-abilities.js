'use strict';
var abilitiesOverlayTemplate = require('../partials/abilities.html');
var optionsOverlayTemplate = require('../partials/options.html');

module.exports = [

  function() {
    this.abilitiesOverlayTemplate = abilitiesOverlayTemplate;

    this.abilitiesCtrl = function($scope, $modalInstance, data) {
      $scope.abilities = data.abilities;

      //Save data from overlay
      $scope.ok = function() {
        $modalInstance.close($scope.abilities);
      }

      //Cancel overlay
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      }

    }

    this.optionsTemplate = optionsOverlayTemplate;
    this.optionsCtrl = function($scope, $modalInstance, data) {
      $scope.options = data;
      //Save data from overlay
      $scope.ok = function() {
        if ($scope.options.publish && $scope.options.location && $scope.options.tag)
          $modalInstance.close();
        else
          $modalInstance.close($scope.options);
      }

      //Cancel overlay
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      }

    }
  }
]