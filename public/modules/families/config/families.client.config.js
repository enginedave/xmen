'use strict';

// Configuring the Articles module
angular.module('families').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Families', 'families', 'dropdown', '/families(/create)?');
		Menus.addSubMenuItem('topbar', 'families', 'List All Families', 'families');
		Menus.addSubMenuItem('topbar', 'families', 'Create New Family', 'families/create');
	}
]);