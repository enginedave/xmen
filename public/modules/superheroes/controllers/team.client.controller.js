'use strict';

angular.module('superheroes').controller('TeamController', ['$scope',
	function($scope) {
		var people = [
			{'name':'David', 'address':'7 Redwood Park','phone':'07738079040'},
			{'name':'Heather', 'address':'7 Redwood Park','phone':'07773189350'},
			{'name':'Betty', 'address':'4 Glendon Park','phone':'02871343322'},
			{'name':'Joe', 'address':'154 Abbeydale','phone':'01289615987'},
		];


		$scope.people = people;
		// Team controller logic
		// ...
	}
]);