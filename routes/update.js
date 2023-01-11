const express = require('express'),
	mongoose = require('mongoose');

const postSchema = require('../models/post');

const router = express.Router({ mergeParams: true });

const Post = mongoose.model('Post', postSchema);

router.put('/', function(req, res) {
	Post.findByIdAndUpdate(
		req.params.id,
		{
			title: req.body.title,
			image: req.body.image,
			post: req.body.post
		},
		{ useFindAndModify: false },
		function(err, foundPost) {
			if (err) {
				console.log('Something went wrong!');
				req.flash('error', 'Something went wrong while updating the post!');
				res.redirect('/');
			} else {
				if (foundPost.length !== 0) {
					console.log('Succesfully updated!');
					req.flash('success', 'Your post has been updated succesfully!');
					res.redirect('/');
				} else {
					console.log('Something went wrong while updating the DB');
					req.flash('error', 'The requested post could not be found!');
					res.redirect('/');
				}
			}
		}
	);
});

module.exports = router;
