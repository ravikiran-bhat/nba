'use strict';
module.exports = [
	'$scope',
	'$state',
	'appCacheService',
	function($scope, $state, appCacheService) {

		//$scope.serverConfig = appCacheService.get('serverConfig');
		$scope.isActiveState = function(s) {
			return $state.is(s);
		}
	}
]