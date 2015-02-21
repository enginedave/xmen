'use strict';

//Setting up route
angular.module('regulations').config(['$stateProvider',
	function($stateProvider) {
		// Regulations state routing
		$stateProvider.
		state('listRegulations', {
			url: '/regulations',
			templateUrl: 'modules/regulations/views/list-regulations.client.view.html'
		}).
		state('createRegulation', {
			url: '/regulations/create',
			templateUrl: 'modules/regulations/views/create-regulation.client.view.html'
		}).
		state('viewRegulation', {
			url: '/regulations/:regulationId',
			templateUrl: 'modules/regulations/views/view-regulation.client.view.html'
		}).
		state('editRegulation', {
			url: '/regulations/:regulationId/edit',
			templateUrl: 'modules/regulations/views/edit-regulation.client.view.html'
		});
	}
]);