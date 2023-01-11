const express = require('express'),
	mongoose = require('mongoose');

const postSchema = require('../models/post');
const currentUser = require('../middleware/index');

const router = express.Router({ mergeParams: true });

const Post = mongoose.model('Post', postSchema);

// Show - Show a particular Blog Post
router.get('/', function(req, res) {
	Post.find({ _id: req.params.id }, function(err, uniquePost) {
		if (err) {
			console.log('Something went wrong!');
			req.flash('error', 'Something went wrong while fetching the post!');
			res.redirect('/');
		} else {
			if (uniquePost.length == 0) {
				console.log('Nothing found in DB');
				req.flash('error', 'The requested post was not found!');
				res.redirect('/');
			} else {
				res.render('show', {
					post: uniquePost[0],
					route: 'show',
					user: req.user,
					error: req.flash('error'),
					success: req.flash('success'),
					isAdmin: currentUser.isAdmin(req)
				});
			}
		}
	});
});

module.exports = router;
