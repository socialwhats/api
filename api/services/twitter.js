var util = require('util');
var path = require('path');

var bot = require("./bot");

var TwitterService = function() {

	if ( arguments.callee._singletonInstance )
    	return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;

	var _this = this;
	var _public = {};

	_this.init = function() {
		return _public;
	};

	_public.start = function() {
		return null;
	};

	_this.onTweetReceived = function(user, tweet) {
		bot.onTweetReceived(user, tweet);
	};

	return _this.init();
}

module.exports = new TwitterService();