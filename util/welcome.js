var pkg = require('../package');

var fs = require('fs');
var util = require('util');
var colors = require('colors');
var path = require('path');

var path = path.join(__dirname, '../config/welcome_message.txt');
var text = fs.readFileSync(path, {encoding: 'utf8'}).toString();

colors.setTheme({
	logo: 'cyan',
	message: "white"
})

text = text.match(/[^\r\n]+/g);

module.exports = {

	init: function(_console) {

		// Inject application version
		var init_msg = text.slice(0, text.length - 3).join('\n');
		init_msg = util.format(init_msg, pkg.version);

		// Show logo
		_console.log((init_msg + "").logo);
	},

	server: function(_console, port) {

		// Inject server port number
		var server_msg = text.slice(text.length - 3, text.length).join('\n');
		server_msg = util.format(server_msg, port);

		// Show server port
		_console.log((server_msg + "").logo);
		_console.log('\n\n');
	},
}