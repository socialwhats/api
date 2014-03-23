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
		type: Schema.ObjectId,
		ref: "message"
	}],

	participants: [{
		type: String
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

ConversationSchema.methods.pushMessage = function(msg, fn) {

	var _this = this;
	var Message = mongoose.model("message");

	Message.find({

		source: {
			provider: msg.provider,
			id: msg.id
		}

	}, function(err, docs) {

		if(err)
			fn(err, null)

		else if(docs.length) {
			fn(null, {exists: true});
		}

		else {

			var message = new Message({

				source: {
					provider: msg.provider,
					id: msg.id
				},

				from: msg.from,
				content: msg.content
			});

			_this.messages.push(message);

			_this.save(function(err) {

				if(err)
					fn(err, null);

				else 
					fn(null, {exists: false});
			})
		}
	})
}

module.exports = ConversationSchema;