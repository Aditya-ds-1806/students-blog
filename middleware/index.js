var currentUser = {};
const keys = require('../config/keys');
const moment = require('moment');

currentUser.isSameUser = function isSameUser(req, res, next) {
	if (req.user.id === req.params.id) {
		next();
	} else {
		req.flash('error', 'You are not allowed to do that!');
		res.redirect('/');
	}
};

currentUser.isLoggedIn = function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		req.flash('error', 'Please Log in before you do that!');
		res.redirect('/');
	}
};

currentUser.postRemove = function postRemove(object, array, ID) {
	if (array.includes(ID)) {
		let index = array.indexOf(ID);
		array.splice(index, 1);
	}
};

currentUser.isAdmin = function isAdmin(req) {
	if (typeof req.user !== 'undefined') {
		return keys.admins.includes(req.user.email);
	}
};

currentUser.isUsersPost = function isUsersPost(req, res, next) {
	if (req.user.posts.includes(req.params.id) || req.user.pendingPosts.includes(req.params.id) || req.user.drafts.includes(req.params.id) || keys.admins.includes(req.user.email)) {
		next();
	} else {
		req.flash('error', 'You are not allowed to do that!');
		res.redirect('/');
	}
};

module.exports = currentUser;
