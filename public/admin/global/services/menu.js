'use strict';
module.exports = [
	'$q',
	'appCacheService',
	'utilsService',
	function($q, appCacheService, Utils) {
		var menu = [];

		var makeMenu = R.compose(checkFeatures, addInitialMenuState, sortMenu);

		function sortMenu(menu) {
			menu.sort(function(a, b) {
				if (a.order > b.order) {
					return 1;
				}
				if (a.order < b.order) {
					return -1;
				}
				return 0;
			});

			return menu;
		}

		/**
		 * Checks sub_menu in the menu object. If available, sets 1st sub_menu object's state as menu state.
		 */
		function addInitialMenuState(menu) {
			menu.forEach(function(menuItem, index, array) {
				if (!menuItem.state && menuItem['sub_menu'] && menuItem['sub_menu'].length)
					menuItem.state = menuItem['sub_menu'][0]['state'];
			});


			return menu;
		}

		/**
		 * Checks features in the admin/config call and removes the menu item if feature is not available.
		 * @return {undefined}
		 */
		function checkFeatures(menu) {
			var features = appCacheService.get('UIConfig')['features'];
			menu = menu.filter(function(m) {
				if (!features.hasOwnProperty(m.id))
					return true;

				return features[m.id]['enabled'];
			});
			return menu;
		}

		/**
		 * Checks API restriction by matching menu id in the api_restriciton object
		 * @param  {object} apiRestriction
		 * @return {undefined}
		 */
		function checkAPIRestriction(menu, apiRestriction) {
			menu.forEach(function(menuItem, index, array) {
				if (_.has(apiRestriction, menuItem.id) && apiRestriction[menuItem.id] === true)
					menuItem['restrict'] = true;

			});
			return menu;
		}


		/**
		 * CHECKS:
		 * 1. Admin config: Check if enabled: true ? Add in menu array : Do not add in menu array.
		 *
		 * 2. Applications: check api_restriction for analytics, extensions, integration, push_limit, storage_limit:
		 *    true ? {restrict: true} : Do not add restrict object.
		 */
		this.getMenu = function(apiRestriction) {
			var clonedMenu = _.map(menu, function(menuItem) {
				return _.cloneDeep(menuItem);
			});

			var madeMenu = makeMenu(clonedMenu);

			if (apiRestriction)
				checkAPIRestriction(madeMenu, apiRestriction);

			return madeMenu;
		}

		this.add = function(menuItem) {
			menu.push(menuItem)
		}
	}
]