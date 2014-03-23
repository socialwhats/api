var mongoose = require("../../mongoose");
var whatsapp = require("./whatsapp");
var mail = require("./mail");
var twitter = require("./twitter");

var S = require("string");
var Conversation = mongoose.model("conversation");
var User = mongoose.model("user");

var BotService = function() {

	if ( arguments.callee._singletonInstance )
		return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;

	var _this = this;
	var _public = {};

	_this.gambiarra = {};

	_this.init = function() {
		return _public;
	}

	_public.start = function(){

		// Start whatsapp middleware
		whatsapp.start({
			
			message: function(messageId, number, message) {
				_public.onMessageReceived(messageId, number, message);
			},

			group: function(group_id, message_id, content, author) {
				_public.onGroupMessageReceived(group_id, message_id, content, author);
			},

			image: function(info) {
				_public.onImageReceived(info);
			}
		});

		// Start mail middleware
		mail.start(function(gmail_id, email) {
			_public.onEmailReceived(gmail_id, email);
		});

		// Start twitter service
		//twitter.start(_public.onTweetReceived);
	}

	_public.onEmailReceived = function(thread, email) {

		if(_this.gambiarra[email.messageId]) return;
		else _this.gambiarra[email.messageId] = true;

		console.log("bot> email received from " + email.from[0].name + "(" + email.from.address + ")");

		var subject = email.subject;
		var whatsapp_id = S(S(S(email.subject).replaceAll('WhatsApp Conversation - ', '').s).replaceAll("@g.us", '')).replaceAll(',', '').s;
		var message = email.from[0].name + ": " + email.text;

		Conversation.getByWhatsAppID(whatsapp_id, function(err, conversation) {

			console.log("bot> conversation found with id: " + conversation._id)

			conversation.pushMessage({

				provider: "whatsapp", 
				id: email.messageId, 
				from: {
					number: null
				}, 
				content: email.text

			}, function(err, message) {

				if(err) {
					console.log("bot> error pushing message (" + email.messageId + ") to conversation (" + conversation._id + ")");
					return;
				}

				else if(!message.exists) {

					// send to all recipients through email
					console.log("bot> forwarding email to whatsapp...")

					var content = email.from[0].name + " (" + email.from[0].address + "): " + email.text;
					// foward email to whatsapp group
					whatsapp.send(whatsapp_id, content, function(err) {

						if(err)
							console.log("bot> error fowarding email: " + err.message || err.toString());
					});
				}

				else {
					console.log("bot> message received already exists... nothing to be done")
				}

			});
		});
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

	_public.onGroupMessageReceived = function(incoming, participants) {

		console.log("bot> group message received from " + incoming.group_id + " with id= " + incoming.message_id);
		console.log(incoming);

		Conversation.getByWhatsAppID(incoming.group_id, function(err, conversation) {

			console.log("bot> group conversation found with id: " + conversation._id)

			conversation.pushMessage({

				provider: "whatsapp", 
				id: incoming.message_id, 
				from: {
					number: incoming.author.replace(/\D/g,'')
				}, 
				content: incoming.content

			}, function(err, message) {

				if(err) {
					console.log("bot> error pushing group message (" + incoming.message_id + ") to conversation (" + conversation._id + ")");
					console.error(err)
					return;
				}

				else if(!message.exists) {

					// send to all recipients through email
					console.log("bot> finding gmail recipients...")

					// find user by phone number
					User.findByParticipants(participants, function(err, users) {

						if(err) {
							console.log("bot> error pushing group message (" + incoming.message_id + ") to gmail");
							console.log("bot> error: " + err.stack || err.toString());
							return;
						}

						else if(!users) {
							console.log("bot> no user found with specified number and valid email");
						}

						else {

							var to = ["bot@socialwhats.co"];

							for(var i = 0; i < users.length; i++) {
								to.push(users[i].email);
							}
							mail.send(to, "WhatsApp Conversation - " + incoming.group_id, incoming.author + ": " + incoming.content);
						}
					})
				}

				else {
					console.log("bot> message received already exists... nothing to be done")
				}
			});

		});

	},

	_public.onImageReceived = function(info) {
		console.log(info);
	}

	_public.onTweetReceived = function(user, tweet) {

		console.log("bot> new tweet received by user: " + user.name);
		var tweet_content = "@" + tweet.user.screen_name +": "+ tweet.text;
		console.log("bot> text: " + tweet_content);

		whatsapp.send(user.number, tweet_content, function(err) {

			if(err)
				console.log("bot> error fowarding tweet: " + err.message || err.toString());
		});
	}

	return _this.init();
}

module.exports = new BotService();