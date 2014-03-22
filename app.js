
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var api = require('./api');

var settings = require("./config/settings");
var mongoose = require('./mongoose');

// Services
var bot = require("./api/services/bot");

// Show welcome message
var welcome = require("./util/welcome");
welcome.init(console);

// Log application bootstrap
var app = express();

// Prepare express
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// api routes list
api.router(app);

// Start server
http.createServer(app).listen(app.get('port'), function() {

	// Show server port
	welcome.server(console, app.get('port'));

	// Start bot
	bot.start();
});
