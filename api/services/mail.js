var bot = require("./bot");
var inbox = require("inbox");

var MailParser = require("mailparser").MailParser;
var mailparser = new MailParser();

var MailService = function(config) {

	if ( arguments.callee._singletonInstance )
    	return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;
	
	var _this = this;
	var _public = {};

	_this.config = config;

	_this.init = function(){

		// XOAUTH2
		_this.client = inbox.createConnection(false, "imap.gmail.com", {
			secureConnection: true,
			auth:{
				XOAuth2:{
					user: config.imap.email,
					clientId: config.google_api.client_id,
					clientSecret: config.google_api.client_secret,
					refreshToken: config.google_api.refresh_token,
					accessToken: config.google_api.access_token,
					timeout: 3600
				}
			}
		});

		return _public;
	}

	_public.start = function(){

		_this.client.on("connect", function(){
			console.log('mail> connected to server!');
			_this.client.openMailbox("INBOX", _this.onMailboxOpen);
		});

		_this.client.on('error', function (err){
			console.log('mail> error: ' + err.message);
		});

		_this.client.on('close', function (){
			console.log('mail> disconnected!');
		});

		_this.client.connect();	
	}

	_this.onMailboxOpen = function(error, info) {
				
		if(error) 
			throw error;

		console.log("mail> inbox message count: " + info.count + "\n\n");
		_this.client.on("new", _this.onNewMessage);
	};

	_this.onNewMessage = function(message) {

		console.log("mail> new incoming message from xGMThreadId: " + message.xGMThreadId);
		console.log("mail> message UID: " + message.UID);

		var first = false;

		mailparser.on("end", function(mail_object){
			bot.onEmailReceived(mail_object);
		});

		// parse email
		_this.client.createMessageStream(message.UID).pipe(mailparser);
	}

	return _this.init();
}

var config = require("../../config/email");
module.exports = new MailService(config);