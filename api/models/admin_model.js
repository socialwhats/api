var mongoose = require('../adapters/mongoose');
var Schema = mongoose.schema;
var extend = require('mongoose-schema-extend');

var Exception = require("../adapters/exceptions");
var check = require('mongoose-validator').validate;
var bcrypt = require('bcrypt');


var AdminSchema = new Schema({

	access: {

		priority: Number,

		role: {
			type: String,
			enum: ['operator', 'root']
		}
	},

	user: {

		type: Schema.ObjectId,
		ref: 'user',

		index: {
			unique: true
		}
	},

	created_at: {
		type: Date,
		default: Date.now		
	},

	last_access: {
		type: Date,
		default: Date.now		
	},

	operation_log: [{
		code: Number,
		description: String,
		date: {
			type: Date,
			default: Date.now
		}
	}]
});

module.exports = AdminSchema;