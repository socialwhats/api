var SocialProvider = function(name, obj) {
	
	var _this = this;
	var _public = {};

	_this.name = name;
	_this.provider = obj;

	_this.init = function(){

		if(!_public.login) {
			throw new Error("No login method in '" + _this.name + "' provider");
		}

		return _public;
	}

	_public.login = function(token, fn) {

		fn = fn || function(){};

		if(!_this.provider.login)
			throw new Error("Provider 'login' method not found");

		_this.provider.login.apply(_this.provider, [token, fn]);
	}

	_public.twitterLogin = function(token, secret, fn) {

		fn = fn || function(){};

		if(!_this.provider.twitterLogin)
			throw new Error("Provider 'twitterLogin' method not found");

		_this.provider.twitterLogin.apply(_this.provider, [token, secret, fn]);
	}	

	return _this.init();
};

module.exports = SocialProvider;