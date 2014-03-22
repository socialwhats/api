var mongoose = require('../adapters/mongoose');

var Admin = mongoose.model('admin');

module.exports = function(req, res, next) {

	console.log(req.cookies.user_id)
	
	Admin.find({

		user: req.cookies.user_id

	}, function(err, docs) {

		if(err) {

			return res.json({
				result: 'error',
				exception: err
			})
		}

		if(!docs.length) {

			return res.json({

				result: 'error',
				exception: {
					code: 1002,
					message: 'Current user account has none admin privileges'
				}
			})
		}

		else
			ok();
	})
}