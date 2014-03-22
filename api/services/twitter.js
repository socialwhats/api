var util = require('util');
var path = require('path');
var mongoose = require("../../mongoose");

var bot = require("./bot");

var User = mongoose.model("user");

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

		console.log("twitter> starting feed service");

		User.find({

			social: {
				provider: "twitter"
			}

		}, function(err, docs) {

			if(err) return null;

			else if(!docs || !docs.length) return null;

			else {

				for(var i = 0; i < docs.length; i++) {
					_this.bindUserStream(docs[i]);
				}

			}
		})
	};

	_this.bindUserStream = function(user) {

		stream.setAccessToken(user.social[0].token);

		stream.on("tweet", function(tweet) {
			_this.onTweetReceived(user, tweet);
		})
	}

	_this.onTweetReceived = function(user, tweet) {
		bot.onTweetReceived(user, tweet);
	};

	return _this.init();
}

module.exports = new TwitterService();