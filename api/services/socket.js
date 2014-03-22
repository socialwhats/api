var log = function(msg) {
	console.log(msg);
}

var config = require("../../config/settings");
config = config[config.state].socket;

var SocketService = function() {

	if ( arguments.callee._singletonInstance )
		return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;
	
	var _this = this;
	var _public = {};

	_this.init = function(){
		_this.io = require('socket.io');
		return _public;
	}

	_public.listen = function() {

		log("socket> initializing server...")
		_this.io = _this.io.listen(config.port);

		log("socket> listening on port " + config.port)
		_this.io.sockets.on('connection', _this.onConnectionReceived);

		return _public;
	}

	_this.onConnectionReceived = function(socket) {

		log("socket> connection received!");

		socket.emit('news', { hello: 'world' });
		socket.on('my other event', function (data) {
			console.log(data);
		});
	}

	return _this.init();
}

module.exports = new SocketService();