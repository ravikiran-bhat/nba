/*
	SSC - Silent search change service.
	Silently changes search params without reloading the current state.
	i.e. The controller for the current state does not reload on changing search params.

	The reason for creating this service is that angular ui-router 0.2.13 currently has an open bug on reloadOnSearch.
	https://github.com/angular-ui/ui-router/issues/1079

*/

module.exports = [
	'$state',
	'$timeout',
	'$location',
	'$q',
	function($state, $timeout, $location, $q) {

		this.change = function(params) {
			var p = $q.defer();
			$state.current.reloadOnSearch = false;
			$location.search(params);
			$timeout(function() {
				$state.current.reloadOnSearch = void 0;
				p.resolve();
			}, 0);

			return p;
		}
	}
]