const express = require('express'),
	mongoose = require('mongoose'),
	htmlToText = require('html-to-text'),
	moment = require('moment');

const userSchema = require('../models/user'),
	postSchema = require('../models/post'),
	keys = require('../config/keys');

const router = express.Router({ mergeParams: true });
const currentUser = require('../middleware/index');

const User = mongoose.model('User', userSchema),
	Post = mongoose.model('Post', postSchema);

// Show profile
router.get('/', currentUser.isLoggedIn, function (req, res) {
	User.findById(req.params.id)
		.populate('posts')
		.populate('likedPosts')
		.populate('bookmarkedPosts')
		.populate('pendingPosts')
		.populate('drafts')
		.exec(function (err, foundUser) {
			if (err) {
				console.log(err);
				req.flash('error', 'User not found!');
				res.redirect('/');
			} else {
				res.render('profile', {
					route: 'profile',
					user: req.user,
					htmlToText: htmlToText,
					profile: foundUser,
					success: req.flash('success'),
					error: req.flash('error'),
					isAdmin: currentUser.isAdmin(req),
					admins: keys.admins,
					moment: moment
				});
			}
		});
});

// Update Profile
router.put('/', currentUser.isLoggedIn, currentUser.isSameUser, function (req, res) {
	console.log(req.body);
	User.findByIdAndUpdate(
		req.user.id,
		{
			description: req.body.description,
			username: req.body.displayName,
			image: req.body.image
		},
		function (err, updatedUser) {
			if (err) {
				console.log(err);
				req.flash('error', 'Something went wrong while updating your profile! Please try again later.');
				res.redirect('/profile/' + updatedUser.id);
			} else {
				console.log('User updated!!!');
				console.log(updatedUser);
				// Update author in posts collection
				Post.find({ authorID: req.user.id }, function (err, foundPosts) {
					for (let i = 0; i < foundPosts.length; i++) {
						const post = foundPosts[i];
						post.author = req.body.displayName;
						post.save(function (err, updatedUser) {
							if (!err) {
								console.log('user updated succesfully');
							}
						});
					}
				});
				// Update Name in comments
				Post.find({}, function (err, foundPosts) {
					for (let i = 0; i < foundPosts.length; i++) {
						const post = foundPosts[i];
						for (let j = 0; j < post.comments.length; j++) {
							const comment = post.comments[j];
							console.log(comment.userID, ' :: ' + req.user.id);
							if (comment.userID == req.user.id) {
								comment.user = req.body.displayName;
								console.log(req.body.displayName, comment.user);
								post.save(function (err, updatedComment) {
									if (!err) {
										console.log('comment updated succesfully');
									}
								});
							}
						}
					}
				});
				req.flash('success', 'Profile updated succesfully!');
				res.redirect('/profile/' + updatedUser.id);
			}
		}
	);
});

module.exports = router;
