var mongoose = require("../../mongoose");
var whatsapp = require("./whatsapp");
var mail = require("./mail");
var twitter = require("./twitter");

var Conversation = mongoose.model("conversation");
var User = mongoose.model("user");

var BotService = function() {

	if ( arguments.callee._singletonInstance )
		return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;

	var _this = this;
	var _public = {};

	_this.init = function() {
		return _public;
	}

	_public.start = function(){

		// Start whatsapp middleware
		whatsapp.start(function(messageId, number, message) {
			_public.onMessageReceived(messageId, number, message);
		});

		// Start mail middleware
		mail.start();

		// Start twitter service
		twitter.start(function(user, tweet) {
			_public.onTweetReceived(user, tweet);
		});
	}

	_public.onEmailReceived = function(thread, email) {

		console.log("bot> email received from " + email.from[0].name + "(" + email.from.address + ")");

		var destination = email.subject.replace(/\D/g,'');
		var message = email.from[0].name + ": " + email.text;

		return null;
	}

	_public.onMessageReceived = function(messageId, num, content) {

		num = num.replace(/\D/g,'');

		console.log("bot> message received from " + num + " with id=" + messageId);

		Conversation.getByWhatsAppID(num, function(err, conversation) {

			console.log("bot> conversation found with id: " + conversation._id)

			conversation.pushMessage({

				provider: "whatsapp", 
				id: messageId, 
				from: {
					number: num
				}, 
				content: content

			}, function(err, message) {

				if(err) {
					console.log("bot> error pushing message (" + messageId + ") to conversation (" + conversation._id + ")");
					return;
				}

				else if(!message.exists) {

					// send to all recipients through email
					console.log("bot> forwarding message to twitter...")

					// find user by phone number
					User.findByPhone(num, function(err, me) {

						if(err) {
							console.log("bot> error pushing message (" + messageId + ") to twitter");
							return;
						}

						else if(me) {
							twitter.send(me, content);
						}

						else {
							console.log("bot> no user found with specified number");
						}
					})
				}

				else {
					console.log("bot> message received already exists... nothing to be done")
				}
			});
		})
	}

	_public.onTweetReceived = function(user, tweet) {

		console.log("bot> new tweet received by user: " + user.name);
		console.log("bot> tweet: " + tweet.text);

		whatsapp.send(user.number, tweet.text, function(err) {

			if(err)
				console.log("bot> error fowarding tweet: " + err.message || err.toString());
		});
	}

	return _this.init();
}

module.exports = new BotService();