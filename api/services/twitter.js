var util = require('util');
var path = require('path');
var mongoose = require("../../mongoose");

var bot = require("./bot");
var Twit = require('twit');

var User = mongoose.model("user");

var DEFAULT_TIMEOUT = 30 * 1000;

var TwitterService = function() {

	if ( arguments.callee._singletonInstance )
    	return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;

	var _this = this;
	var _public = {};

	_this.interval = null;

	_this.init = function() {
		return _public;
	};

	_public.start = function(listener) {

		_this.listener = listener;
		console.log("twitter> starting feed service");

		_this.interval = setInterval(_this.refresh, DEFAULT_TIMEOUT);
		_this.refresh();
	};

	_this.refresh = function(){

		console.log("twitter> refreshing twitter feed");

		User.find({

			"social.provider": "twitter"

		}, function(err, docs) {

			if(err) return null;

			else if(!docs || !docs.length) return null;

			else {

				for(var i = 0; i < docs.length; i++) {
					//ALTEREI CÓDIGO AQUI, PRA VOLTAR SÓ TIRAR DO IF
					if(docs[i].isTwitterEnabled){
						_this.bindUserStream(docs[i]);
					}
				}

			}
		})

	}

	_public.stop = function() {
		clearInterval(_this.interval);
	}

	_this.bindUserStream = function(user) {

		var T = new Twit({
		    consumer_key:         '7oeukZFRvCs6fyxrpXvNgA', 
		    consumer_secret:      '1ue2gGU37AxYI8NkarcYAN7mFVk83jP3zr2Yy7dPQw',
		    access_token:         user.social[0].token,
		    access_token_secret:  user.social[0].secret
		});

		if(!user.last_tweet) {
			T.get('statuses/home_timeline', { count: 5 },  function (err, reply) {
				if(err || !reply || !reply.length) {
					console.log('twitter> error catching new tweets from user'+user.id);
				}

				console.log(reply);

				for(var i=reply.length-1; i >= 0; i--){
					if(reply[i].user.name != user.name){
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

				if(err) {
					console.log('twitter> error catching new tweets from user: ' + (err.message || err.toString()));
				}

				else if(!reply || !reply.length) {
					console.log('twitter> no tweets found for user '+user.id);
				}

				else {	
					for(var i = reply.length-2; i >= 0; i--){
						if(reply[i].user.name != user.name){
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
				}
			})
		}
	}

	_this.onTweetReceived = function(user, tweet) {
		_this.listener(user, tweet);
	}

	_public.send = function(user, text) {
		var T = new Twit({
		    consumer_key:         '7oeukZFRvCs6fyxrpXvNgA', 
		    consumer_secret:      '1ue2gGU37AxYI8NkarcYAN7mFVk83jP3zr2Yy7dPQw',
		    access_token:         user.social[0].token,
		    access_token_secret:  user.social[0].secret
		});

		//ALTEREI CÓDIGO AQUI, PRA VOLTAR É SÓ TIRAR DO IF
		if(user.isTwitterEnabled) {
			T.post('statuses/update', { status: text }, function(err, data) {
			  	if(err) {
			  		console.log('twitter> error creating new tweet');
			  	} else {
			  		console.log('twitter> twitter created successfully!');
			  	}
			});
		}
	}

	return _this.init();
}

module.exports = new TwitterService();