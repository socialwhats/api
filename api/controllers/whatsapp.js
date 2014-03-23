var request = require("request");
var whatsapp = require("../services/whatsapp");

module.exports = {
	
	onMessageReceived: function(req, res) {

		if(!req.param("number") || !req.param("message")) {
			res.json({
				result: "error",
				exception: "message details missing"
			})
		}

		whatsapp.onMessageReceived(req.param("message_id"), req.param("number"), req.param("message"));

		res.json({
			result: "success"
		});
	},

	onImageReceived: function(req, res) {

		if(!req.param("number") || !req.param("message") || !req.param("url")) {
			res.json({
				result: "error",
				exception: "message details missing"
			})
		}

		whatsapp.onImageReceived({
			message_id: req.param("message_id"),
			number: req.param("number"), 
			url: req.param("url")
		});

		res.json({
			result: "success"
		});
	},

	onGroupInfo: function(req, res) {

		if(!req.param("group") || !req.param("participants")) {
			return res.json({
				result: "error",
				exception: "message details missing"
			})
		}

		whatsapp.onGetGroupInfo(req.param("group"), req.param("participants"));
	},

	onGroupMessageReceived: function(req, res) {

		if(!req.param("number") || !req.param("message_id")) {
			return res.json({
				result: "error",
				exception: "message details missing"
			})
		}

		whatsapp.onGroupMessageReceived(req.param("number"), req.param("message_id"), req.param("content"), req.param("author"));

		res.json({
			result: "success"
		});
	}
}