'use strict';

// Regulations controller
angular.module('regulations').controller('RegulationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Regulations',
	function($scope, $stateParams, $location, Authentication, Regulations) {
		$scope.authentication = Authentication;

		// Create new Regulation
		$scope.create = function() {
			// Create new Regulation object
			var regulation = new Regulations ({
				name: this.name
			});

			// Redirect after save
			regulation.$save(function(response) {
				$location.path('regulations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Regulation
		$scope.remove = function(regulation) {
			if ( regulation ) { 
				regulation.$remove();

				for (var i in $scope.regulations) {
					if ($scope.regulations [i] === regulation) {
						$scope.regulations.splice(i, 1);
					}
				}
			} else {
				$scope.regulation.$remove(function() {
					$location.path('regulations');
				});
			}
		};

		// Update existing Regulation
		$scope.update = function() {
			var regulation = $scope.regulation;

			regulation.$update(function() {
				$location.path('regulations/' + regulation._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Regulations
		$scope.find = function() {
			$scope.regulations = Regulations.query();
		};

		// Find existing Regulation
		$scope.findOne = function() {
			$scope.regulation = Regulations.get({ 
				regulationId: $stateParams.regulationId
			});
		};
	}
]);