var Exception = require("../adapters/exceptions")
var mongoose = require('../adapters/mongoose');
var check = require('mongoose-validator').validate;
var bcrypt = require('bcrypt');

var Schema = mongoose.schema;

var MessageSchema = new Schema({
	
	source: {

		provider: {
			type: String,
			enum: ["twitter", "whatsapp", "gmail"]
		},

		id: String
	},

	from: {
		email: String,
		number: String,
	},

	content: String,

	created_at: {
		type: Date,
		default: Date.now
	}
});

module.exports = MessageSchema;
