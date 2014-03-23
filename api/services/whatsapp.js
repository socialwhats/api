var request = require('request');
var querystring = require("querystring");
var util = require('util');
var path = require('path');

var mongoose = require("../../mongoose");
var bot = require("./bot");

var Conversation = mongoose.model("conversation");

var ROOT_PY = 'http://localhost:8080/?'

var WhatsAppService = function() {

	if ( arguments.callee._singletonInstance )
    	return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;

	var _this = this;
	var _public = {};

	_this.groupMessageQueue = {};

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
		_this.listener.message(messageId, number, content);
	}

	_public.onImageReceived = function(info) {
		_this.listener.image(messageId, number, content);
	}

	_public.onGroupMessageReceived = function(group_id, message_id, content, author) {

		console.log("whatsapp> on message group received " + group_id);

		var incomingMessage = {
			group_id: group_id,
			message_id: message_id,
			content: content,
			author: author
		}

		_this.groupMessageQueue[incomingMessage.group_id] = incomingMessage;
		_public.requestGroupInfo(incomingMessage.group_id);
	}

	_public.requestGroupInfo = function(group_id) {

		var params = querystring.stringify({action: "group_info", jid: group_id});
		
		request(ROOT_PY + params, function (error, response, body) {

			if (!error && response.statusCode == 200) {
				console.log("whatsapp> requested group info for " + group_id)
			}

			else {
				console.log("whatsapp> error requesting group info for " + group_id)
			}
		})		
	}

	_public.onGetGroupInfo = function(group_id, participants) {
		var incomingMessage = _this.groupMessageQueue[group_id];
		_this.listener.group(incomingMessage, participants);
	}

	_public.send = function(num, msg, fn) {

		fn = fn || function(){};

		var params = querystring.stringify({action: "send", dest: num, message: msg});
		
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