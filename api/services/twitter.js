var util = require('util');
var path = require('path');
var mongoose = require("../../mongoose");

var bot = require("./bot");
var Twit = require('twit');

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

			"social.provider": "twitter"

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

		var T = new Twit({
		    consumer_key:         '7oeukZFRvCs6fyxrpXvNgA', 
		    consumer_secret:      '1ue2gGU37AxYI8NkarcYAN7mFVk83jP3zr2Yy7dPQw',
		    access_token:         user.social[0].token,
		    access_token_secret:  user.social[0].secret
		});

		if(!user.last_tweet) {
			T.get('statuses/home_timeline', { count: 5 },  function (err, reply) {
				if(err || !reply.lenght) {
					console.log('twitter> error catching new tweets from user'+user.id);
				}

				for(var i=reply.length-1; i >= 0; i--){
					if(reply[i].user.name != user.name){
						console.log(reply[i].text);
						_this.onTweetReceived(user, reply[i]);
					}

					if(i === 0){
						user.last_tweet = reply[i].id;
						user.save(function(err) {
							if(err) 
								console.log('twitter> error saving last tweet id:'+reply[i].id);
						});
					}
				}


			
			})
		} else {

			T.get('statuses/home_timeline', { count: 5, since_id: user.last_tweet },  function (err, reply) {
				if(err || !reply.lenght) {
					console.log('twitter> error catching new tweets from user'+user.id);
				}

				for(var i=reply.length-2; i >= 0; i--){
					if(reply[i].user.name != user.name){
						console.log(reply[i].text);
						_this.onTweetReceived(user, reply[i]);
					}

					if(i === 0){
						user.last_tweet = reply[i].id;
						user.save(function(err) {
							if(err) 
								console.log('twitter> error saving last tweet id:'+reply[i].id);
						});
					}
				}
			})
		}
	}

	_this.onTweetReceived = function(user, tweet) {
		bot.onTweetReceived(user, tweet);
	};

	_public.send = function(user, text) {
		console.log("xupa joao");
		return null;
	}

	return _this.init();
}

module.exports = new TwitterService();