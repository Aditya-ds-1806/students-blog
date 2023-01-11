const express = require('express'),
	mongoose = require('mongoose'),
	methodOverride = require('method-override');

const router = express.Router({ mergeParams: true });

const postSchema = require('../models/post');
const userSchema = require('../models/user');
const currentUser = require('../middleware/index');

const Post = mongoose.model('Post', postSchema);
const User = mongoose.model('User', userSchema);

router.delete('/', currentUser.isLoggedIn, currentUser.isUsersPost, function (req, res) {
	Post.findByIdAndDelete(req.params.id, function (err, foundPost) {
		if (err) {
			req.flash('error', 'Something went wrong while deleting the post!');
			return res.redirect('/');
		} else {
			console.log(foundPost);
			if (foundPost.length !== 0) {
				console.log('Deleted ' + foundPost.title + ' from DB :(');
			} else {
				console.log('Something went wrong while deleting the post from DB');
				req.flash('error', 'Something went wrong while deleting the post!');
				return res.redirect('/');
			}
		}
	});
	User.find({}, function (err, foundUsers) {
		if (err) {
			console.log(err);
			req.flash('error', 'Something went wrong while deleting the post!');
			return res.redirect('/');
		} else {
			for (let i = 0; i < foundUsers.length; i++) {
				const user = foundUsers[i];
				currentUser.postRemove(user, user.posts, req.params.id);
				currentUser.postRemove(user, user.bookmarkedPosts, req.params.id);
				currentUser.postRemove(user, user.likedPosts, req.params.id);
				if (user.id === req.user.id) {
					currentUser.postRemove(user, user.pendingPosts, req.params.id);
					currentUser.postRemove(user, user.drafts, req.params.id);
				}
				user.save(function (err, savedUser) {
					if (err) {
						console.log(err);
						req.flash('error', 'Something went wrong while deleting the post!');
						return res.redirect('/');
					} else {
						console.log('Post has been removed from all user accounts.');
					}
				});
			}
			req.flash('success', 'Your Post has been deleted!');
			res.redirect('/');
		}
	});
});

module.exports = router;
