'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Regulation = mongoose.model('Regulation'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, regulation;

/**
 * Regulation routes tests
 */
describe('Regulation CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Regulation
		user.save(function() {
			regulation = {
				name: 'Regulation Name'
			};

			done();
		});
	});

	it('should be able to save Regulation instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Regulation
				agent.post('/regulations')
					.send(regulation)
					.expect(200)
					.end(function(regulationSaveErr, regulationSaveRes) {
						// Handle Regulation save error
						if (regulationSaveErr) done(regulationSaveErr);

						// Get a list of Regulations
						agent.get('/regulations')
							.end(function(regulationsGetErr, regulationsGetRes) {
								// Handle Regulation save error
								if (regulationsGetErr) done(regulationsGetErr);

								// Get Regulations list
								var regulations = regulationsGetRes.body;

								// Set assertions
								(regulations[0].user._id).should.equal(userId);
								(regulations[0].name).should.match('Regulation Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Regulation instance if not logged in', function(done) {
		agent.post('/regulations')
			.send(regulation)
			.expect(401)
			.end(function(regulationSaveErr, regulationSaveRes) {
				// Call the assertion callback
				done(regulationSaveErr);
			});
	});

	it('should not be able to save Regulation instance if no name is provided', function(done) {
		// Invalidate name field
		regulation.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Regulation
				agent.post('/regulations')
					.send(regulation)
					.expect(400)
					.end(function(regulationSaveErr, regulationSaveRes) {
						// Set message assertion
						(regulationSaveRes.body.message).should.match('Please fill Regulation name');
						
						// Handle Regulation save error
						done(regulationSaveErr);
					});
			});
	});

	it('should be able to update Regulation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Regulation
				agent.post('/regulations')
					.send(regulation)
					.expect(200)
					.end(function(regulationSaveErr, regulationSaveRes) {
						// Handle Regulation save error
						if (regulationSaveErr) done(regulationSaveErr);

						// Update Regulation name
						regulation.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Regulation
						agent.put('/regulations/' + regulationSaveRes.body._id)
							.send(regulation)
							.expect(200)
							.end(function(regulationUpdateErr, regulationUpdateRes) {
								// Handle Regulation update error
								if (regulationUpdateErr) done(regulationUpdateErr);

								// Set assertions
								(regulationUpdateRes.body._id).should.equal(regulationSaveRes.body._id);
								(regulationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Regulations if not signed in', function(done) {
		// Create new Regulation model instance
		var regulationObj = new Regulation(regulation);

		// Save the Regulation
		regulationObj.save(function() {
			// Request Regulations
			request(app).get('/regulations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Regulation if not signed in', function(done) {
		// Create new Regulation model instance
		var regulationObj = new Regulation(regulation);

		// Save the Regulation
		regulationObj.save(function() {
			request(app).get('/regulations/' + regulationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', regulation.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Regulation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Regulation
				agent.post('/regulations')
					.send(regulation)
					.expect(200)
					.end(function(regulationSaveErr, regulationSaveRes) {
						// Handle Regulation save error
						if (regulationSaveErr) done(regulationSaveErr);

						// Delete existing Regulation
						agent.delete('/regulations/' + regulationSaveRes.body._id)
							.send(regulation)
							.expect(200)
							.end(function(regulationDeleteErr, regulationDeleteRes) {
								// Handle Regulation error error
								if (regulationDeleteErr) done(regulationDeleteErr);

								// Set assertions
								(regulationDeleteRes.body._id).should.equal(regulationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Regulation instance if not signed in', function(done) {
		// Set Regulation user 
		regulation.user = user;

		// Create new Regulation model instance
		var regulationObj = new Regulation(regulation);

		// Save the Regulation
		regulationObj.save(function() {
			// Try deleting Regulation
			request(app).delete('/regulations/' + regulationObj._id)
			.expect(401)
			.end(function(regulationDeleteErr, regulationDeleteRes) {
				// Set message assertion
				(regulationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Regulation error error
				done(regulationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Regulation.remove().exec();
		done();
	});
});