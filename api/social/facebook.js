var settings = require("../../config/settings")
var graph = require('fbgraph');
var request = require("request");

var Provider = require('./provider');

var facebookProvider = new Provider('facebook', {
	
	login: function(token, fn) {

		var _this = this;
		fn = fn || function(){};

		graph.setAccessToken(token);

		var params = {
			fields: "id,name,email",
			access_token: token
		};

		graph.get("me", params, function(err, data){

			if(err) {
				fn(err, null);
				return;
			}

			_this.profilePicture(data.id, function(err, picture) {

				fn(null, {

					name: data.name,
					email: data.email,
					image: picture,

					social: {
						provider: "facebook",
						token: token
					}
				});
			})
		})		
	},

	profilePicture: function(fbid, fn) {

		fn = fn || function(){};

		var pictureUrl = "http://graph.facebook.com/" + fbid.toString() + "/picture?type=large";

		request(pictureUrl, function(error, response, body) {

			if(error)
				return fn(error, null);
			else
				return fn(null, response.request.uri.href)

		})
	}
});

module.exports = facebookProvider;