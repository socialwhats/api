var mongoose = require("../../mongoose");
var whatsapp = require("./whatsapp");
var mail = require("./mail");

var Conversation = mongoose.model("conversation");

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
		whatsapp.start(function(number, message) {
			console.log("nois")
			_public.onMessageReceived("thread", number, message);
		});

		// Start mail middleware
		mail.start();
	}

	_public.onEmailReceived = function(thread, email) {

		console.log("bot> email received from " + email.from[0].name + "(" + email.from.address + ")");

		var destination = email.subject.replace(/\D/g,'');
		var message = email.from[0].name + ": " + email.text;

		return null;
	}

	_public.onMessageReceived = function(thread, num, message) {
		console.log("bot> message received from " + num);
		mail.send("luiseduardo14@gmail.com", num, message)
	}

	_public.onTweetReceived = function(user, tweet) {
		console.log("bot> message received from " + num);
		mail.send("luiseduardo14@gmail.com", num, message)
	}

	// ----------- Binded Methods -----------------//
	_this.sendGreeting = function(destination) {
		
	}

	_this.onGreetingReceived = function() {
		
	}

	return _this.init();
}

module.exports = new BotService();