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
	title: {
		type: String,
		default: '',
		required: 'Please complete the Regulation title',
		trim: true
	},
	section: {
		type: String,
		default: '',
		required: 'Please complete the Regulation section',
		trim: true
	},
	number: {
		type: String,
		default: '',
		required: 'Please complete the Regulation number',
		trim: true
	},
	regText: {
		type: String,
		default: '',
		required: 'Please complete the Regulation text',
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