var request = require('request');
var querystring = require("querystring");
var util = require('util');
var path = require('path');

var bot = require("./bot");

var ROOT_PY = 'http://localhost:8080/'

var WhatsAppService = function() {

	if ( arguments.callee._singletonInstance )
    	return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;

	var _this = this;
	var _public = {};

	_this.init = function(){

		_this.listener = function(){};
		console.log("whatsapp> starting service");
		return _public;
	}

	_public.start = function(listener) {

		_this.listener = listener;
		console.log("whatsapp> preparing python listener");
	}

	_public.onMessageReceived = function(messageId, number, content) {
		_this.listener(messageId, number, content);
	}

	_public.send = function(num, msg, fn) {

		fn = fn || function(){};

		var params = querystring.stringify({number: num, message: msg});
		
		request(ROOT_PY + params, function (error, response, body) {

			if (!error && response.statusCode == 200) {

				console.log("whatsapp> message sent to " + num)
				fn(null, true)
			}

			else {
				fn(error, null)
			}
		})
	}

	return _this.init();
}

module.exports = new WhatsAppService();