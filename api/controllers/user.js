var input = require("../adapters/input");
var social = require("../adapters/social");
var mongoose = require('../adapters/mongoose');
var OAuth= require('oauth').OAuth;

var User = mongoose.model('user');

var oa = new OAuth(
				'https://api.twitter.com/oauth/request_token',
				'https://api.twitter.com/oauth/access_token',
				'7oeukZFRvCs6fyxrpXvNgA',
				'1ue2gGU37AxYI8NkarcYAN7mFVk83jP3zr2Yy7dPQw',
				'1.0A',
      			'http://node.socialwhats.co/api/user/twtcallback',
      			'HMAC-SHA1'	
		);	

module.exports = {

	me: function(req, res) {

		User.find({

			_id: req.cookies.user_id

		}, function(err, me) {

			if(err) {

				return res.json({
					result: 'error',
					exception: err
				});
			}

			else if(!me || !me.length) {

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

			me = me[0];

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
			message: 'login> user logged out successfully'
		})
	},

	complete_login: function(req, res) {

		if(!req.param('number')) {
			res.json({

				result: 'error',
				exception: {
					message: 'login> missing or invalid phone number',
					error: {
						missing_fields: ['number']
					}
				}
			});
		}

		User.find({

			_id: req.cookies.user_id

		}, function(err, me) {

			me = me[0]
			me.number = req.param('number');

			if(req.param('email')) {
				me.email = req.param('email');
			}

			me.save(function(err){

				if(err){
					res.json({
						result: 'error',
						exception: {
							message: 'login> cant save phone number or email',
							error: err
						}
					});
				}

				else {
					res.json({
						result: 'success',
						message: 'login> extra information saved with success'
					})
				} 
			});
		})
	},

	change_number: function(req, res) {

		if(!req.param('number')) {
			res.json({

				result: 'error',
				exception: {
					message: 'update> missing or invalid phone number',
					error: {
						missing_fields: ['number']
					}
				}
			});
		}

		User.find({

			_id: req.cookies.user_id

		}, function(err, me) {
			if(err) {
				return res.json({
					result: 'error',
					exception: err
				});
			}

			else if (!me || !me.length) {
				return res.json({

					result: 'error',
					exception: {
						code: 1001,
						message: 'Internal error, user not found'
					}
				});
			}

			me = me[0];
			me.number = req.param('number');

			me.save(function(err){
				if(err){
					res.json({
						result: 'error',
						exception: {
							message: 'update> cant save phone number',
							error: err
						}
					});
				}

				else {
					res.json({
						result: 'update> new number saved with success'
					})
				} 
			});
		})
	},

	change_email: function(req, res) {

		if(!req.param('email')) {
			res.json({

				result: 'error',
				exception: {
					message: 'update> missing or invalid email',
					error: {
						missing_fields: ['email']
					}
				}
			});
		}

		User.find({

			_id: req.cookies.user_id

		}, function(err, me) {
			if(err) {
				return res.json({
					result: 'error',
					exception: err
				});
			}

			else if (!me || !me.length) {
				return res.json({

					result: 'error',
					exception: {
						code: 1001,
						message: 'Internal error, user not found'
					}
				});
			}

			me = me[0];
			me.email = req.param('email');

			me.save(function(err){
				if(err){
					res.json({
						result: 'error',
						exception: {
							message: 'update> cant save email',
							error: err
						}
					});
				}

				else {
					res.json({
						result: 'update> new email saved with success'
					})
				} 
			});
		})
	},

	disable_twitter: function(req, res) {
		User.find({

			_id: req.cookies.user_id

		}, function(err, me) {
			if(err) {
				return res.json({
					result: 'error',
					exception: err
				});
			}

			else if (!me || !me.length) {
				return res.json({

					result: 'error',
					exception: {
						code: 1001,
						message: 'Internal error, user not found'
					}
				});
			}

			me = me[0];

			if(!me.social[0].token) {
				return res.json({
					result: 'error',
					exception: {
						message: 'disable> cant disable cause its disabled!',
						error: err
					}
				});
			}

			me.disable.token = me.social[0].token;
			me.social[0].token = null;

			me.save(function(err){
				if(err){
					res.json({
						result: 'error',
						exception: {
							message: 'disable> cant disabled twitter',
							error: err
						}
					});
				}

				else {
					res.json({
						result: 'disable> twitter disabled with success',
						data: me
					})
				} 
			});
		})
	},

	enable_twitter: function(req, res) {
		User.find({

			_id: req.cookies.user_id

		}, function(err, me) {
			if(err) {
				return res.json({
					result: 'error',
					exception: err
				});
			}

			else if (!me || !me.length) {
				return res.json({

					result: 'error',
					exception: {
						code: 1001,
						message: 'Internal error, user not found'
					}
				});
			}

			me = me[0];

			if(!me.disable.token) {
				return res.json({
					result: 'error',
					exception: {
						message: 'enable> cant enable cause its enabled!',
						error: err
					}
				});
			}

			me.social[0].token = me.disable.token;
			me.disable.token = null;

			me.save(function(err){
				if(err){
					res.json({
						result: 'error',
						exception: {
							message: 'enable> cant enabled twitter',
							error: err
						}
					});
				}

				else {
					res.json({
						result: 'enable> twitter enabled with success',
						data: me
					})
				} 
			});
		})
	},

	disable_email: function(req, res) {
		User.find({

			_id: req.cookies.user_id

		}, function(err, me) {
			if(err) {
				return res.json({
					result: 'error',
					exception: err
				});
			}

			else if (!me || !me.length) {
				return res.json({

					result: 'error',
					exception: {
						code: 1001,
						message: 'Internal error, user not found'
					}
				});
			}

			me = me[0];

			if(!me.email) {
				return res.json({
					result: 'error',
					exception: {
						message: 'disnable> cant disable cause its disabled!',
						error: err
					}
				});
			}

			me.disable.email = me.email;
			me.email = null;

			me.save(function(err){
				if(err){
					res.json({
						result: 'error',
						exception: {
							message: 'disable> cant disabled email',
							error: err
						}
					});
				}

				else {
					res.json({
						result: 'disable> email disabled with success',
						data: me
					})
				} 
			});
		})
	},

	enable_email: function(req, res) {
		User.find({

			_id: req.cookies.user_id

		}, function(err, me) {
			if(err) {
				return res.json({
					result: 'error',
					exception: err
				});
			}

			else if (!me || !me.length) {
				return res.json({

					result: 'error',
					exception: {
						code: 1001,
						message: 'Internal error, user not found'
					}
				});
			}

			me = me[0];

			if(!me.disable.email) {
				return res.json({
					result: 'error',
					exception: {
						message: 'enable> cant enable cause its enabled!',
						error: err
					}
				});
			}
			me.email = me.disable.email;
			me.disable.email = null;

			me.save(function(err){
				if(err){
					res.json({
						result: 'error',
						exception: {
							message: 'enable> cant enabled email',
							error: err
						}
					});
				}

				else {
					res.json({
						result: 'enable> email enabled with success',
						data: me
					})
				} 
			});
		})
	},

	update_status: function(req, res) {
		User.find({

			_id: req.cookies.user_id

		}, function(err, me) {
			if(err) {
				return res.json({
					result: 'error',
					exception: err
				});
			}

			else if (!me || !me.length) {
				return res.json({

					result: 'error',
					exception: {
						code: 1001,
						message: 'Internal error, user not found'
					}
				});
			}

			me = me[0];
			
			return res.json({
				twitter: me.isTwitterEnabled,
				email: me.isEmailEnabled,
			})
		});
	},

	clear: function(req, res) {
		User.find({

			_id: req.cookies.user_id

		}, function(err, me) {
			if(err) {
				return res.json({
					result: 'error',
					exception: err
				});
			}

			else if (!me || !me.length) {
				return res.json({

					result: 'error',
					exception: {
						code: 1001,
						message: 'Internal error, user not found'
					}
				});
			}

			me = me[0];
			
			me.remove(function(err){
				if(err) {
					res.json({
						result: 'error',
						exception: {
							message: 'clear> cant remove user',
							error: err
						}
					});
				}

				else {
					res.json({
						result: 'clear> user removed with success',
						data: me
					})
				}
			});
		});
	},

	social_login: function(req, res) {

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
	},

	twitter_request: function(req, res) {

		oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
			if (error) {
				console.log(error);
				res.send("yeah no. didn't work.")
			}
			else {
				req.session.oauth = {};
				
				req.session.oauth.token = oauth_token;
				req.session.oauth.token_secret = oauth_token_secret;

				res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
			}
		});
	},

	twitter_callback: function(req, res) {

		console.log('ENTROU AQUI -----------------------------');

		if(!req.param('oauth_token') || !req.param('oauth_verifier')) {

			res.json({

				result: 'error',
				exception: {
					message: 'Missing required params.',
					error: {
						missing_fields: ['oauth', 'verifier']
					}
				}
			});
		}

		var token = req.param('oauth_token');
		var verifier = req.param('oauth_verifier');

		if (req.session.oauth) {
			
			var oauth = req.session.oauth;
			req.session.oauth.verifier = verifier;

			oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, function(error, oauth_access_token, oauth_access_token_secret, results){
				if (error){
					console.log(error);
					res.send("twitter> error catching access token");
				} else {
					req.session.oauth.access_token = oauth_access_token;
					req.session.oauth,access_token_secret = oauth_access_token_secret;

					var access = oauth_access_token;
					var secret = oauth_access_token_secret;
					
					//SOCIAL LOGIN

					var provider;

					try {
						provider = social.provider('twitter');
					}

					catch(e) {
						return res.json({

							result: 'error',
							exception: {
								message: 'The social provider twitter does not exist',
								error: {
									name: e.name,
									message: e.message,
									line: e.stack
								}
							}
						})
					}

					provider.twitterLogin(access, secret, function(err, socialInfo) {

						if(err) {
							return res.json({
								result: 'error',
								exception: err
							});
						}

						User.socialAuth(socialInfo, function(err, me) {

							res.cookie("user_id", me._id);

							if(err) {

								return res.json({
									result: 'error',
									exception: err
								});
							}

							else {

								return res.redirect('http://www.socialwhats.co/signup.html';
								// return res.redirect('http://www.google.com');
							}

						})
					});
				}
			});
		} 
		else {
			console.log("twitter> no user in session");
		}
	}
}