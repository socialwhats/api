module.exports = {

	world: function(req, res) {

		var response = {
			message: req.param("message"),
			from: req.param("from")
		};

		console.log(response);

		res.json(response);
	}
}