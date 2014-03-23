module.exports = function(req, res, ok) {
	
	if(req.cookies.user_id) {
		ok();
	}

	else {
		res.json({
			result: 'error',
			exception: {
				code: 1000,
				message: 'User not logged in'
			}
		})
	}
}