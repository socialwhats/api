var sendgrid = require('sendgrid')("whatsappbot", "zapzapbotxupajoao");

var SendGridAdapter = function() {

	if ( arguments.callee._singletonInstance )
    	return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;
	
	var _this = this;
	var _public = {};

	_this.init = function() {
		return _public;
	}

	_public.send = function(to, subject, message, fn) {

		fn = fn || function(){};

		if(!to) {
			throw new Error("No valid destinations to send the email")
		}

		if(!Array.isArray(to)) {
			to = [to]
		}

		sendgrid.send({

			to: to[0],
			from: "bot@socialwhats.co",
			subject: subject,
			text: message

		}, function(err, json) {

			if (err) { 
				return console.error(err); 
			}

			console.log(json);

			fn();
		});
	}

	return _this.init();
}

module.exports = new SendGridAdapter();