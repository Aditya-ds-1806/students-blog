const express = require('express'),
	mongoose = require('mongoose'),
	htmlToText = require('html-to-text');

const currentUser = require('../middleware/index');
const postSchema = require('../models/post');

const router = express.Router({ mergeParams: true });

const Post = mongoose.model('Post', postSchema);

// Index - List All Blogs
router.get('', function(req, res) {
	Post.find({ approved: true }, function(err, foundPosts) {
		if (err) {
			res.sendStatus(400);
			console.log('Something went wrong');
		} else {
			if (foundPosts.length == 0) {
				res.sendStatus(404);
				console.log('Nothing found in DB');
			} else {
				res.render('index', {
					posts: foundPosts,
					route: 'index',
					htmlToText: htmlToText,
					user: req.user,
					error: req.flash('error'),
					success: req.flash('success'),
					isAdmin: currentUser.isAdmin(req)
				});
			}
		}
	});
});

// Edit - Shows edit form
router.get('/:id/edit', currentUser.isLoggedIn, currentUser.isUsersPost, function(req, res) {
	Post.find({ _id: req.params.id }, function(err, retrievedPost) {
		if (err) {
			res.sendStatus(400);
			console.log('Something went wrong while retrieving the post!');
			req.flash('error', 'Something went wrong while fetching the post!');
			res.redirect('/');
		} else {
			if (retrievedPost.length == 0) {
				res.sendStatus(404);
				console.log('Nothing Found in DB');
			} else {
				res.render('edit', {
					route: 'edit',
					post: retrievedPost[0],
					user: req.user,
					isAdmin: currentUser.isAdmin(req)
				});
			}
		}
	});
});

// New - Show form to add new blog
router.get('/new', currentUser.isLoggedIn, function(req, res) {
	res.render('new', { route: 'new', user: req.user, isAdmin: currentUser.isAdmin(req) });
});

module.exports = router;
