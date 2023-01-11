const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const userSchema = require('../models/user');
const keys = require('./keys');

const User = mongoose.model('User', userSchema);

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(null, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.google.clientID,
			clientSecret: keys.google.clientSecret,
			callbackURL: keys.google.callbackURL
		},
		function(accessToken, refreshToken, profile, done) {
			console.log('passport callback function has fired');
			User.findOne({ googleID: profile.id }, function(err, existingUser) {
				if (existingUser) {
					console.log('User exists in DB: ', existingUser.email);
					done(null, existingUser);
				} else {
					User.create(
						{
							googleID: profile.id,
							username: profile.name.givenName,
							image: profile.photos[0].value,
							email: profile.emails[0].value
						},
						function(err, addedUser) {
							if (!err) {
								console.log(addedUser.username + ' was added to the DB');
								// Send Email to new user
								const send = require('gmail-send')({
									user: keys.mail.email,
									pass: keys.mail.password,
									to: profile.emails[0].value,
									subject: 'Hello there!'
								});
								send(
									{
										text: 'Thank you for signing up to ECE Blog. Regads, ECE Blog team',
										html:
											'<h3>Thank you for signing up to ECE Blog</h3><p>Regards,</p><p style="margin: 0;"><strong>ECE Blog Team</strong></p>'
									},
									function(error, result, fullResult) {
										if (error) {
											console.error(error);
										} else {
											console.log(result);
										}
									}
								);
								done(null, addedUser);
							}
						}
					);
				}
			});
		}
	)
);
