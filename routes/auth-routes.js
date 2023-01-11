const express = require('express');
const router = express.Router();
const passport = require('passport');
const currentUser = require('../middleware/index');

// ------------------------------------------------------------
// ---------------------- Auth Routes -------------------------
// ------------------------------------------------------------

router.get(
	'/google',
	passport.authenticate('google', {
		hd: 'iiitdm.ac.in',
		prompt: 'select_account',
		scope: [ 'profile', 'email' ]
	})
);

// Google will redirect to this route after auth
router.get('/google/callback', passport.authenticate('google'), function(req, res) {
	console.log('I went to /google/callback');
	console.log(req.user);
	req.flash('success', 'Welcome Back ' + req.user.username);
	res.redirect('/');
});

router.get('/logout', currentUser.isLoggedIn, function(req, res) {
	req.logout();
	req.flash('success', 'You have been logged out succesfully!');
	res.redirect('/');
});

module.exports = router;
