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

ConversationSchema.statics.getByGmailID = function(id, fn) {

	var _Conversation = this;

	_Conversation.findOne({

		gmail: {
			thread_id: id
		}

	}, function(err, conversation) {

		if(err)
			return fn(err, null)

		else if(!conversation) {

			var conv = new _Conversation({

				gmail: {
					thread_id: id
				}
			})

			conv.save(function(err) {

				if(err)
					return fn(err, null)

				fn(null, conv)
			})
		}
		else
			fn(null, conv)
	})
}

ConversationSchema.statics.getByWhatsAppID = function(id, fn) {

	var _Conversation = this;

	_Conversation.findOne({

		whatsapp: {
			thread_id: id
		}

	}, function(err, conversation) {

		if(err)
			return fn(err, null)

		else if(!conversation) {

			var conv = new _Conversation({

				whatsapp: {
					thread_id: id
				}
			})

			conv.save(function(err) {
				
				if(err)
					return fn(err, null)

				fn(null, conv)
			})
		}
		else
			fn(null, conv)
	})
}

module.exports = ConversationSchema;