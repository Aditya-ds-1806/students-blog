const mongoose = require('mongoose');
const router = require('express').Router();
const postSchema = require('../models/post');
const userSchema = require('../models/user');
const currentUser = require('../middleware/index');
const htmlToText = require('html-to-text');

const Post = mongoose.model('Post', postSchema);
const User = mongoose.model('User', userSchema);

// Admin Dashboard
router.get('/admin/:id/dashboard', currentUser.isLoggedIn, function (req, res) {
	Post.find({ approved: false, isDraft: false }, function (err, unApprovedPosts) {
		if (err) {
			console.log(err);
			req.flash('error', 'Something went wrong while retrieving the posts');
			res.redirect('/');
		} else {
			if (currentUser.isAdmin(req)) {
				res.render('admin', {
					route: 'admin',
					isAdmin: currentUser.isAdmin(req),
					user: req.user,
					posts: unApprovedPosts,
					htmlToText: htmlToText
				});
			} else {
				req.flash('error', 'Unauthorized Access');
				res.redirect('/');
			}
		}
	});
});

// Request for approval
router.post('/admin/approved', currentUser.isLoggedIn, function (req, res) {
	if (currentUser.isAdmin(req)) {
		const postID = req.body.postID;
		Post.findOne({ _id: postID }, function (err, foundPost) {
			if (err) {
				console.log('Post not found');
				req.flash('error', 'The Requested post was not found!');
				res.redirect('/');
			} else {
				foundPost.approved = true;
				foundPost.save(function (err, r) {
					if (err) {
						req.flash('error', 'Something went wrong while updating status of post!');
						res.redirect('/');
					} else {
						console.log('Post has been approved!');
					}
				});
				// Update user in user collection
				User.findOne({ _id: foundPost.authorID }, function (err, foundUser) {
					if (err) {
						console.log(err);
						req.flash('error', 'The user was not found!');
						res.redirect('/');
					} else {
						const postIndex = foundUser.pendingPosts.indexOf(foundPost.id);
						foundUser.pendingPosts.splice(postIndex, 1);
						foundUser.posts.push(foundPost.id);
						foundUser.save(function (err, res) {
							if (err) {
								console.log(err);
							} else {
								console.log('Pendingposts array updated succesfully!');
							}
						});
					}
				});
			}
		});
	} else {
		req.flash('error', 'Unauthorized Access!');
		res.redirect('/');
	}
});

// Request for disapproval
router.post('/admin/notapproved', currentUser.isLoggedIn, function (req, res) {
	if (currentUser.isAdmin(req)) {
		const postID = req.body.postID;
		Post.findOne({ _id: postID }, function (err, foundPost) {
			if (err) {
				console.log('Post not found');
				req.flash('error', 'The Requested post was not found!');
				res.redirect('/');
			} else {
				foundPost.approved = false;
				foundPost.save(function (err, r) {
					if (err) {
						req.flash('error', 'Something went wrong while updating status of post!');
						res.redirect('/');
					} else {
						console.log('Post has not been approved!');
					}
				});
				// Update user in user collection
				User.findOne({ _id: foundPost.authorID }, function (err, foundUser) {
					if (err) {
						console.log(err);
						req.flash('error', 'The user was not found!');
						res.redirect('/');
					} else {
						const postIndex = foundUser.posts.indexOf(foundPost.id);
						foundUser.posts.splice(postIndex, 1);
						foundUser.pendingPosts.push(foundPost.id);
						foundUser.save(function (err, res) {
							if (err) {
								console.log(err);
							} else {
								console.log('Pendingposts array updated succesfully!');
							}
						});
					}
				});
			}
		});
	} else {
		req.flash('error', 'Unauthorized Access!');
		res.redirect('/');
	}
});

module.exports = router;
