var util = require('util');
var path = require('path');
var child_process = require('child_process');
var zerorpc = require("zerorpc");

var WhatsAppBridge = function(src) {

	if ( arguments.callee._singletonInstance )
    	return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;

	var _this = this;
	var _public = {};

	_this.init = function(){

		console.log("whatsapp> starting service");
		return _public;
	}

	_public.startListening = function() {

		console.log("whatsapp> preparing python listener");

		_this.spawn(["-l"], function(err, line) {

			if(err) {
				console.log("whatsapp> Error listening:" + err.toString())
			}

			else {
				console.log("whatsapp> New message: " + line)
			}
		})
	}

	_this.onReceiveMessage = function(msg) {
		return null;
	}

	_this.spawn = function(params, fn) {

		var cli_file = src + "/yowsup-cli";
		var config_file  = src + "/config";

		var params = [cli_file, "-c " + config_file].concat(params);
		var s = child_process.spawn("python", params);

		s.stdout.on('data', function (data) {
			fn(null, data);
		});

		s.stderr.on('data', function (data) {
			fn(data, null)
		});

		s.on('close', function (code) {
			console.log('whatsapp> child process exited with code ' + code);
		});
	}

	_this.exec = function(params, fn) {

		var cli_file = src + "/yowsup-cli";
		var config_file  = src + "/config";

		var params = [cli_file, " -c " + config_file].concat(params);
		child_process.exec("python " + params.join(" "), params, fn);
	}

	_public.requestCode = function(fn) {
		_this.exec(["--requestcode sms"], function(err, stdout, stderr) {
			fn(err, stdout);
		})
	}

	_public.register = function(request_code, fn) {
		_this.exec(["-r" + request_code], function(err, stdout, stderr) {
			fn(err, stdout);
		})
	}

	_public.send = function(num, msg, fn) {
		_this.exec(["--send ", num, ' "' + msg + '"'], function(err, stdout, stderr) {
			fn(err, stdout);
		})
	}

	return _this.init();
}

module.exports = new WhatsAppBridge(path.join(__dirname, '../../py/yowsup'));