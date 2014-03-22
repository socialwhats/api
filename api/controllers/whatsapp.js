var whatsapp = require("../services/whatsapp");

module.exports = {
	
	onMessageReceived: function(req, res) {

		if(!req.param("number") || !req.param("message")) {
			res.json({
				result: "error",
				exception: "message details missing"
			})
		}

		whatsapp.onMessageReceived(req.param("number"), req.param("message"));

		res.json({
			result: "success"
		});
	},

	onGroupMessageReceived: function(req, res) {

		if(!req.param("number") || !req.param("message")) {
			res.json({
				result: "error",
				exception: "message details missing"
			})
		}

		//whatsapp.onMessageReceived(req.param("number"), req.param("message"));

		console.log(req.param("number"));
		console.log(req.param("message"));

		res.json({
			result: "success"
		});
	}
}