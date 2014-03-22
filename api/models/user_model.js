var Exception = require("../adapters/exceptions")
var mongoose = require('../adapters/mongoose');
var check = require('mongoose-validator').validate;
var bcrypt = require('bcrypt');

var Schema = mongoose.schema;

var UserSchema = new Schema({

	name: {

		required: true,
		type: String
	},

	email: {

		required: true,

		type: String,
		validate: [
			check('isEmail'),
			check('len', 3)
		],

		index: { 
			unique: true 
		}
	},

	password: {

		// For social authentication
		required: false,

		type: String,

		validate: check({

			message: "Password should be at least 6 characters long",
			passIfEmpty: true

		}, 'len', 6)
	},

	social: [{

		token: {
			type: String,
		},

		provider: {
			type: String,
			enum: ['email', 'google', 'facebook'],
			default: 'email'
		}
	}],
	
	uri: String,
	image: String

}, {
	toObject: {
		virtuals: true
	}
});

UserSchema
	.virtual('isMobile')
	.get(function () {

		var devices = this.devices || [];
		return (!!devices.length)
	});

UserSchema
	.virtual('isWeb')
	.get(function () {

		var devices = this.devices || [];
		return (!devices.length)
	});

UserSchema.statics.auth = function(candidate, fn) {

	// Prepare callback
	fn = fn || function(){};

	// Get users by email addr
	this.find({

		email: candidate.email

	}, function(err, docs) {

		var user = docs[0]

	});
}

UserSchema.statics.auth = function (user, cb) {

	this.findOne({ 

		email: user.email

	}, function(err, candidate) {

		if(err) {
			return fn(err);
		}

		if(!candidate) {
			return fn(Exception.UserNotFound);
		}

		console.log(candidate.password);

		var bcrypt = require("bcrypt");
		bcrypt.compare(user.password, candidate.password, function(err, isMatch) {

			if (err) 
				return cb(err, null);

			else if(!isMatch)
				return cb(null, false);

			else
				cb(null, candidate);
		});
	});
};

UserSchema.statics.socialAuth = function(info, fn) {

	var _User = this;

	_User.findOne({

		email: info.email 

	}, function(err, user) {

		if(err)
			return fn(err, null);

		else if(!user) {

			info.social = [info.social];
			var user = new _User(info);
		}

		else {

			if(!user.social || !user.social.length) {
				user.social = [info.social];
			}

			else {

				var found = false;

				for(var i = 0; i < user.social.length; i++) {
					if(user.social[i].provider === info.social.provider) {
						user.social.token = info.social.token
						found = true;
					}
				}

				if(!found)
					user.social.push(info.social);
			}
		}

		user.save(function(err) {

			if(err)
				fn(err);
			else
				fn(null, user);
		});
	})

};

UserSchema.methods.toJSON = function() {

	var obj = this.toObject();

	obj.id = obj._id;
	delete obj._id;

	delete obj.password;
	delete obj.__v;

	for(var i = 0; i < obj.social.length; i++) {
		delete obj.social[i].id;
		delete obj.social[i]._id;
	}

	return obj;
}

// ---------- Password Encryption ---------- //
UserSchema.pre('save', function(next) {

	var bcrypt = require("bcrypt");
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) 
		return next();

	// generate a salt
	bcrypt.genSalt(10, function(err, salt) {

		if (err) 
			return next(err);

		// hash the password along with our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {

			if (err) return next(err);

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

module.exports = UserSchema;