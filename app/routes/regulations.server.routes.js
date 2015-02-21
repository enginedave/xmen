'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var regulations = require('../../app/controllers/regulations.server.controller');

	// Regulations Routes
	app.route('/regulations')
		.get(regulations.list)
		.post(users.requiresLogin, regulations.create);

	app.route('/regulations/:regulationId')
		.get(regulations.read)
		.put(users.requiresLogin, regulations.hasAuthorization, regulations.update)
		.delete(users.requiresLogin, regulations.hasAuthorization, regulations.delete);

	// Finish by binding the Regulation middleware
	app.param('regulationId', regulations.regulationByID);
};
