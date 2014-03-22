var util = require('util');

var InputAdapter = function() {

	var _this = this;
	var _public = {};

	_this.init = function() {
		return _public;
	}

	_public.check = function(method, params, opt) {

		opt = opt || {};

		opt.message = opt.message || 'Missing required fields: %s';

		var results = {}, errors = [];

		for(var i = 0; i < params.length; i++) {

			if(method(params[i])) {
				results[params[i]] = method(params[i]);
				continue;
			}

			errors.push(params[i]);
		}

		if(errors.length)
			throw new Error(util.format(opt.message, errors.join(', ')));

		return results;
	}

	return _this.init();
}

module.exports = new InputAdapter();