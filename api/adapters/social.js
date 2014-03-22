var SocialProviderAdapter = function() {

	var _this = this;
	var _public = {};

	_this.init = function() {
		return _public;
	}

	_public.provider = function(name) {

		var provider;

		try {
			provider = require('../social/' + name);
		}

		catch(e) {
			throw e;
		}

		return provider;
	}

	return _this.init();
}

module.exports = new SocialProviderAdapter();