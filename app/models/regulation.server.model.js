'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Regulation Schema
 */
var RegulationSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Regulation name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Regulation', RegulationSchema);