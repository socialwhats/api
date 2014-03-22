var mongoose = require("../services/mongoose");
var whatsapp = require("../services/whatsapp");
var sendgrid = require("../adapters/sendgrid");

var Bot = mongoose.model("bot");

var BotService = function(ack) {

	if ( arguments.callee._singletonInstance )
		return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;

	var _this = this;
	var _public = {};

	_this.ack = ack;

	_this.init = function() {
		return _public;
	}

	_public.onEmailReceived = function(email) {

		console.log("bot> email received from " + email.from[0].name + "(" + email.from.address + ")");

		// TODO: parse email and strip reply content
		var destination = email.subject.replace(/\D/g,'');
		var message = email.from[0].name + ": " + email.text;

		whatsapp.send(destination, message, function(){
			console.log("bot> email fowarded to whatsapp successfully!\n");
		});

		return null;
	}

	_public.onGreetingReceived = function(message) {



	}

	_public.onMessageReceived = function(message) {

		// TODO: send emails using sendgrid
		return null;
	}

	return _this.init();
}

module.exports = new BotService(ack);