const express = require('express'),
	mongoose = require('mongoose');

const userSchema = require('../models/user'),
	postSchema = require('../models/post');

const router = express.Router({ mergeParams: true });

const User = mongoose.model('User', userSchema),
	Post = mongoose.model('Post', postSchema),
	currentUser = require('../middleware/index');

// Create - Create new post and redirect to Index Route
router.post('/', currentUser.isLoggedIn, function (req, res) {
	console.log('received a new post');
	var newPost = {
		title: req.body.title,
		image: req.body.image,
		post: req.body.post,
		author: req.user.username,
		authorID: req.user.id,
		date: Date(),
		email: req.user.email
	};
	if (req.query.draftID === undefined) {
		// draftID not found, => create new post
		console.log('DraftID not found, creating new post');
		Post.create(newPost, function (err, newPost) {
			if (err) {
				req.flash('error', 'Something went wrong while submitting your post');
				res.redirect('back');
				console.log('There was an error while submitting the post to the DB');
				console.log(err);
			} else {
				console.log(newPost + ' was added to the DB succesfully');
				User.findOne({ googleID: req.user.googleID }, function (err, foundUser) {
					if (err) {
						req.flash('error', 'Something went wrong while submitting your post');
						res.redirect('back');
						console.log(err);
					} else {
						console.log(foundUser);
						foundUser.pendingPosts.push(newPost);
						foundUser.save(function (err, user) {
							if (err) {
								req.flash('error', 'Something went wrong while submitting your post');
								res.redirect('back');
								console.log(err);
							} else {
								req.flash('success', 'Your post has been submitted and is under review!');
								res.redirect('/');
							}
						});
					}
				});
			}
		});
	} else {
		// draft found, convert it to post
		Post.findByIdAndUpdate(req.query.draftID, { isDraft: false }, function (err, post) {
			if (err) {
				console.log(err);
			} else {
				console.log('approved set to false');
			}
		});
		User.findOne({ _id: req.user.id }, function (err, user) {
			if (err) {
				console.log(err);
			} else {
				currentUser.postRemove(user, user.drafts, req.query.draftID);
				user.pendingPosts.push(req.query.draftID);
				user.save(function (err, savedUser) {
					if (err) {
						console.log(err);
						req.flash('error', 'Something went wrong while submitting your draft for review!');
						res.redirect('/');
					} else {
						console.log('Draft has been moved to the pendingPosts array!');
						req.flash('success', 'Your post has been submitted succesfully and is under review!');
						res.redirect('/');
					}
				});
			}
		});
	}
});

module.exports = router;
