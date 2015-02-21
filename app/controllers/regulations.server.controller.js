'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Regulation = mongoose.model('Regulation'),
	_ = require('lodash');

/**
 * Create a Regulation
 */
exports.create = function(req, res) {
	var regulation = new Regulation(req.body);
	regulation.user = req.user;

	regulation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(regulation);
		}
	});
};

/**
 * Show the current Regulation
 */
exports.read = function(req, res) {
	res.jsonp(req.regulation);
};

/**
 * Update a Regulation
 */
exports.update = function(req, res) {
	var regulation = req.regulation ;

	regulation = _.extend(regulation , req.body);

	regulation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(regulation);
		}
	});
};

/**
 * Delete an Regulation
 */
exports.delete = function(req, res) {
	var regulation = req.regulation ;

	regulation.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(regulation);
		}
	});
};

/**
 * List of Regulations
 */
exports.list = function(req, res) { 
	Regulation.find().sort('-created').populate('user', 'displayName').exec(function(err, regulations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(regulations);
		}
	});
};

/**
 * Regulation middleware
 */
exports.regulationByID = function(req, res, next, id) { 
	Regulation.findById(id).populate('user', 'displayName').exec(function(err, regulation) {
		if (err) return next(err);
		if (! regulation) return next(new Error('Failed to load Regulation ' + id));
		req.regulation = regulation ;
		next();
	});
};

/**
 * Regulation authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.regulation.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
