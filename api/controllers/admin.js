var mongoose = require('../adapters/mongoose');
var User = mongoose.model('user');
var Admin = mongoose.model('admin');

module.exports = {

	info: function(req, res) {

		Admin
			.findOne(req.cookies.user_id)
			.populate('user')
			.exec(function(err, admin) {

				if(err) {
					return res.json({
						result: 'error',
						exception: err
					})
				}

				else if(!admin) {

					return res.json({

						result: 'error',

						exception: {
							code: 2000,
							message: 'Internal error, admin access information not found'
						}
					})	
				}

				else {
					return res.json({
						result: 'success',
						admin: admin
					})
				}
			})
	},

	create: function(req, res) {

	}
}