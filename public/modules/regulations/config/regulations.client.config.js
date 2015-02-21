'use strict';

// Configuring the Articles module
angular.module('regulations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Regulations', 'regulations', 'dropdown', '/regulations(/create)?');
		Menus.addSubMenuItem('topbar', 'regulations', 'List Regulations', 'regulations');
		Menus.addSubMenuItem('topbar', 'regulations', 'New Regulation', 'regulations/create');
	}
]);