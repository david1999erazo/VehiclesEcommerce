var mongoose = require('mongoose');
const User = require("../models/userModel")
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../../config/APIconnection');

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	
	passport.use(new FacebookStrategy({
		clientID			: config.facebook.key,
		clientSecret	: config.facebook.secret,
		callbackURL	 : '/auth/facebook/callback',
		profileFields : ['id', 'displayName', /*'provider',*/ 'photos']
	}, function(accessToken, refreshToken, profile, done) {
		User.findOne({provider_id: profile.id}, function(err, user) {
			if(err) throw(err);
				console.log("Bad login")
			if(!err && user!= null) return done(null, user);

			var user = new User({
                
                idNumber: profile.id,
                fullName: profile.displayName,
                email: profile.value,
                
			});
			user.save(function(err) {
				if(err) throw err;
				done(null, user);
			});
		});
	}));

};