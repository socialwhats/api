var map = require("../dict/bot");
var S = require("string");

var BotAckService = function(map) {

	if ( arguments.callee._singletonInstance )
		return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;

	var _this = this;
	var _public = {};

	_this.callbackMap = {};

	_public.bind = function(key, fn) {
		_this.callbackMap[key] = fn;
	}

	_public.recognize = function(content) {

		var method = _this.checkMethod(content || "");

		if(!method || !method.key)
			return false;

		if(_this.callbackMap[method.key]) {
			_this.callbackMap[method.key](method.value);
		}
	};

	_this.checkMethod = function(content) {

		content = S(content).capitalize().s;

		for(var k in map) {

			var capitalizedKey = S(k).capitalize().s

			// Check key contains
			if(S(content).contains(capitalizedKey)) {
				return {key: k, value: map[k]};
			}

			var aliases = map[k].alias || [];

			for(var i = 0; i < aliases.length; i++) {

				var capitalizedAlias = S(aliases[i]).capitalize().s

				if(S(content).contains(capitalizedAlias)) {
					return {key: k, value: map[k]};
				}
			}
		}

		return false;
	}

	_this.init = function() {
		return _public;
	}

	return _this.init();
}

module.exports = new BotAckService(map);