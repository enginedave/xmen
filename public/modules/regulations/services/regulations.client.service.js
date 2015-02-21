'use strict';

//Regulations service used to communicate Regulations REST endpoints
angular.module('regulations').factory('Regulations', ['$resource',
	function($resource) {
		return $resource('regulations/:regulationId', { regulationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);