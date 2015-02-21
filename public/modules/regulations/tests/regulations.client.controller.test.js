'use strict';

(function() {
	// Regulations Controller Spec
	describe('Regulations Controller Tests', function() {
		// Initialize global variables
		var RegulationsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Regulations controller.
			RegulationsController = $controller('RegulationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Regulation object fetched from XHR', inject(function(Regulations) {
			// Create sample Regulation using the Regulations service
			var sampleRegulation = new Regulations({
				name: 'New Regulation'
			});

			// Create a sample Regulations array that includes the new Regulation
			var sampleRegulations = [sampleRegulation];

			// Set GET response
			$httpBackend.expectGET('regulations').respond(sampleRegulations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.regulations).toEqualData(sampleRegulations);
		}));

		it('$scope.findOne() should create an array with one Regulation object fetched from XHR using a regulationId URL parameter', inject(function(Regulations) {
			// Define a sample Regulation object
			var sampleRegulation = new Regulations({
				name: 'New Regulation'
			});

			// Set the URL parameter
			$stateParams.regulationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/regulations\/([0-9a-fA-F]{24})$/).respond(sampleRegulation);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.regulation).toEqualData(sampleRegulation);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Regulations) {
			// Create a sample Regulation object
			var sampleRegulationPostData = new Regulations({
				name: 'New Regulation'
			});

			// Create a sample Regulation response
			var sampleRegulationResponse = new Regulations({
				_id: '525cf20451979dea2c000001',
				name: 'New Regulation'
			});

			// Fixture mock form input values
			scope.name = 'New Regulation';

			// Set POST response
			$httpBackend.expectPOST('regulations', sampleRegulationPostData).respond(sampleRegulationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Regulation was created
			expect($location.path()).toBe('/regulations/' + sampleRegulationResponse._id);
		}));

		it('$scope.update() should update a valid Regulation', inject(function(Regulations) {
			// Define a sample Regulation put data
			var sampleRegulationPutData = new Regulations({
				_id: '525cf20451979dea2c000001',
				name: 'New Regulation'
			});

			// Mock Regulation in scope
			scope.regulation = sampleRegulationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/regulations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/regulations/' + sampleRegulationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid regulationId and remove the Regulation from the scope', inject(function(Regulations) {
			// Create new Regulation object
			var sampleRegulation = new Regulations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Regulations array and include the Regulation
			scope.regulations = [sampleRegulation];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/regulations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRegulation);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.regulations.length).toBe(0);
		}));
	});
}());