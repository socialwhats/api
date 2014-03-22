var sendgrid = require("sendgrid");

var SendGridAdapter = new function() {
	
	var _this = this;
	var _public = {};

	_this.init = function() {
		return _public;
	}

	_public.send = function(to, email, fn) {

		fn = fn || function(){};

		if(!to) {
			throw new Error("No valid destinations to send the email")
		}

		if(!Array.isArray(to)) {
			to = [to]
		}


	}
}