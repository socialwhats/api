var settings = require("../../config/settings");
var request = require("request");

var Provider = require('./provider');

var Twit = require('twit')

var twitterProvider = new Provider('twitter', {

	twitterLogin: function(token, secret, fn) {

		var _this = this;
		fn = fn || function(){};

		var T = new Twit({
		    consumer_key:         '7oeukZFRvCs6fyxrpXvNgA', 
		    consumer_secret:      '1ue2gGU37AxYI8NkarcYAN7mFVk83jP3zr2Yy7dPQw',
		    access_token:         token,
		    access_token_secret:  secret
		});

		//faz requisição passando as infos do app e os tokens do usuário
		T.get('account/verify_credentials', function(err, data){
			if(err) {
				return res.json({
					result:'error',
					exception: err
				});
			} else {
				fn(null, {
					name: data.name,
					image: data.profile_image_url,
					social: {
						provider: "twitter",
						token: token,
						secret: secret,
						screen_name: data.screen_name
					}
				});
			}
		})
	}
})

module.exports = twitterProvider;