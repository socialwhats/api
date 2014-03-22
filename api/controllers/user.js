var input = require("../adapters/input");
var social = require("../adapters/social");
var mongoose = require('../adapters/mongoose');

var User = mongoose.model('user');

module.exports = {

	me: function(req, res) {

		User.findOne(req.cookies.user_id, function(err, me) {

			if(err) {

				return res.json({
					result: 'error',
					exception: err
				});
			}

			else if(!me) {

				res.cookie('logged_in', 'false');
				res.cookie('user_id', 'true');

				return res.json({

					result: 'error',
					exception: {
						code: 1001,
						message: 'Internal error, user not found'
					}
				});
			}

			return res.json({
				result: 'success',
				user: me
			});
		})
	},

	create: function(req, res) {

		// Create new user with supplied info
		var user = new User({
			name: req.param('name'),
			email: req.param('email'),
			password: req.param('password'),
			social: req.param('social'),
			devices: req.param('devices'),
			uri: req.param('uri'),
			image: req.param('image')
		});

		// Try to save to database
		user.save(function(err) {

			if(err) {

				if (11000 === err.code || 11001 === err.code) { 

					return res.json({
						result: 'error',
						exception: {
							code: 11000,
							message: 'This email is already being used in another account',
						}
					})
				}

				else {
					return res.json({
						result: 'error',
						exception: err
					})
				}
			}

			return res.json({
				result: 'success',
				user: user
			})
		})
	},

	login: function(req, res) {
		
		User.auth({

			email: req.param('email'),
			password: req.param('password')

		}, function(err, me) {

			if(err) {
				return res.json({
					result: 'error',
					exception: err
				})
			}

			res.cookie('logged_in', 'true');
			res.cookie('user_id', me._id);

			return res.json({
				result: 'success',
				user: me
			})
		})
	},

	logout: function(req, res) {

		res.cookie('logged_in', 'false');
		res.cookie('user_id', "null");

		res.json({
			result: 'success',
			message: 'User logged out successfully'
		})
	},

	social_login: function(req, res) {

		var params = ['provider', 'social'];

		if(!req.param('provider') || !req.param('token')) {

			res.json({

				result: 'error',
				exception: {
					message: 'The social provider was not supplied',
					error: {
						missing_fields: ['provider', 'token']
					}
				}
			});
		}

		// Social provider interface
		var provider;

		try {

			// Try to call the social provider
			provider = social.provider(req.param('provider'));
		}

		catch(e) {

			return res.json({

				result: 'error',
				exception: {
					message: 'The social provider "' + req.param('provider') + '" does not exist',
					error: {
						name: e.name,
						message: e.message,
						line: e.stack
					}
				}
			})
		}

		provider.login(req.param('token'), function(err, socialInfo) {

			User.socialAuth(socialInfo, function(err, me) {

				if(err) {

					return res.json({
						result: 'error',
						exception: err
					});
				}

				else {

					return res.json({
						result: 'success',
						user: me
					})
				}

			})
		});
	},

	social_add: function(req, res) {

		User.findOne(req.cookies.user_id, function(err, me) {

			if(err) {

				return res.json({
					result: 'error',
					exception: err
				});
			}

			else {

				me.social.push({
					provider: req.param('provider'),
					access_token: req.param('access_token')
				})

				me.save(function(err) {

					if(err) {

						return res.json({
							result: 'error',
							exception: err
						});
					}

					else {
						res.json({
							result: 'success',
							user: me
						})
					}
				})
			}
		})
	}
}