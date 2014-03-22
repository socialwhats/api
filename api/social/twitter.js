var settings = require("../../config/settings");
var request = require("request");

var Provider = require('./provider');

var twitterProvider = new Provider('twitter', {

	twitterLogin: function(token, token_sct, fn) {

		var _this = this;
		fn = fn || function(){};

		//faz requisição passando as infos do app e os tokens do usuário

		//retorno objeto no callback
		fn(null, {
			name:
			email:

		})
	}

})