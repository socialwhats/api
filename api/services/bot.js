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

		// bind messages
		return _public;
	}

	_public.start = function(){

		// Start whatsapp middleware
		whatsapp.start();

		// Start mail middleware
		mail.start();
	}

	_public.onEmailReceived = function(thread, email) {

		console.log("bot> email received from " + email.from[0].name + "(" + email.from.address + ")");

		var destination = email.subject.replace(/\D/g,'');
		var message = email.from[0].name + ": " + email.text;

		return null;
	}

	_public.onMessageReceived = function(thread, message) {
		return null;
	}

	_this.syncSend = function(message) {

		// send email
		mail.send(message);

		// send whatsapp
		whatsapp.send(destination, message, function(){
			console.log("bot> email fowarded to whatsapp successfully!\n");
		});
	}

	// ----------- Binded Methods -----------------//
	_this.onGreetingReceived = function(message) {
		
	}

	return _this.init();
}

module.exports = new BotService();