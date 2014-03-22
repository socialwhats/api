var Exception = require("../adapters/exceptions")
var mongoose = require('../adapters/mongoose');
var check = require('mongoose-validator').validate;
var bcrypt = require('bcrypt');

var Schema = mongoose.schema;

var ConversationSchema = new Schema({

	gmail: {
		thread_id: String
	},

	whats_app: {
		thread_id: String
	},

	messages: [{

		from: {
			email: String,
			number: String,
		},

		content: String,

		created_at: {
			type: Date,
			default: Date.now
		},

		forwarded: {
			type: Boolean,
			default: false
		}
	}],

	recipients: [{

		user: {
			type: Schema.ObjectId,
			ref: "user"
		},

		// THIS MUST BE UNIQUE
		// Check in method addRecipient
		number: String,
		email: String
	}]
});

module.exports = ConversationSchema;