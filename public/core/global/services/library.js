'use strict';
module.exports = [
	'$q',
	'$rootScope',
	function($q, $rootScope) {

		var libraries = [];
		var libRequests = {}

		/**
		 * Registers the library name and resolves all the promises of the library
		 * which are stored in the libRequests.
		 * @param  {[type]} lib [description]
		 * @return {[type]}     [description]
		 */
		this.register = function(lib) {
			libraries.push(lib);

			if (!libRequests[lib])
				return

			for (var i = 0; i < libRequests[lib].length; i++) {
				libRequests[lib][i].resolve();
			};
		}

		this.has = function(lib) {
			return libraries.indexOf(lib) > -1;
		}
		/**
		 * Checks if library requested is registered. If yes, resolves success.
		 * If not, queues up the promise and resolves it later when the library is registered.
		 * @param  {string} lib - The library name.
		 * @return {promise}
		 */
		this.get = function(lib) {
			if (libraries.indexOf(lib) > -1) {
				return $q.when(lib);
			} else {
				var deferred = $q.defer();
				libRequests.hasOwnProperty(lib) ? libRequests[lib].push(deferred) : libRequests[lib] = [deferred];
				return deferred.promise;
			}
		}
	}
]