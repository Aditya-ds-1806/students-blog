const express = require('express'),
	mongoose = require('mongoose');

const userSchema = require('../models/user'),
	postSchema = require('../models/post');

const router = express.Router();
const currentUser = require('../middleware/index');

const User = mongoose.model('User', userSchema),
	Post = mongoose.model('Post', postSchema);

// Handle Comments
router.post('/blogs/:id/comment', currentUser.isLoggedIn, function (req, res) {
	console.log('I received an ajax call');
	Post.findOne({ _id: req.params.id }, function (err, foundPost) {
		if (err) {
			console.log(err);
		} else {
			foundPost.comments.push({
				user: req.user.username,
				userID: req.user.id,
				text: req.body.commentText,
				image: req.user.image,
				date: Date()
			});
			foundPost.save(function (err, post) {
				if (err) {
					console.log(err);
					res.sendStatus(404);
				} else {
					console.log('Comment added!');
					res.sendStatus(200);
				}
			});
		}
	});
	console.log(req.body, req.user.username);
});

// deliver partial for single cmment
router.get('/blogs/:id/getCommentPartial', function (req, res) {
	Post.findOne({ _id: req.params.id }, function (err, post) {
		res.render('partials/singleComment', { post: post, i: post.comments.length - 1, user: req.user });
	});
});

router.delete('/blogs/:id/:cid/delete', currentUser.isLoggedIn, function (req, res) {
	console.log('I received an ajax delete call');
	Post.findOne({ _id: req.params.id }, function (err, foundPost) {
		// No err possible
		for (let i = 0; i < foundPost.comments.length; i++) {
			const comment = foundPost.comments[i];
			if (comment._id.toString() === req.params.cid) {
				foundPost.comments.splice(i, 1);
				// update post
				foundPost.save(function (err, updatedPost) {
					if (err) {
						console.log(err);
						res.sendStatus(200);
					} else {
						console.log('comment deleted!');
						res.sendStatus(200);
					}
				});
				break;
			}
		}
	});
});

// Handle Likes
router.post('/like', currentUser.isLoggedIn, function (req, res) {
	console.log(req.body);
	// increment likes
	Post.findByIdAndUpdate(req.body.postID, { likes: req.body.likes }, { useFindAndModify: false }, function (
		err,
		foundPost
	) {
		if (err) {
			console.log(err);
		} else {
			console.log('updated posts Collection');
		}
	});
	// Add to user's liked posts
	User.findById(req.user.id, function (err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			if (req.body.likeState === 'true' && !foundUser.likedPosts.includes(req.body.postID)) {
				foundUser.likedPosts.push(req.body.postID);
				foundUser.save(function (err, savedUser) {
					if (!err) {
						console.log('Liked Post added to DB');
					}
				});
			} else if (req.body.likeState === 'false') {
				var index = foundUser.likedPosts.indexOf(req.body.postID);
				foundUser.likedPosts.splice(index, 1);
				foundUser.save(function (err, savedUser) {
					if (!err) {
						console.log('Unliked Post removed from DB');
					}
				});
			}
		}
	});
});

// Handle Bookmarks
router.post('/bookmark', currentUser.isLoggedIn, function (req, res) {
	console.log(req.body);
	Post.findByIdAndUpdate(req.body.postID, { bookmarks: req.body.bookmarks }, { useFindAndModify: false }, function (
		err,
		foundPost
	) {
		if (err) {
			console.log(err);
		} else {
			console.log('updated posts Collection');
		}
	});
	User.findById(req.user.id, function (err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			console.log(foundUser);
			if (req.body.bookmarkState === 'true' && !foundUser.bookmarkedPosts.includes(req.body.postID)) {
				foundUser.bookmarkedPosts.push(req.body.postID);
				foundUser.save(function (err, savedUser) {
					console.log('Bookmarked Post added to DB');
				});
			} else if (req.body.bookmarkState === 'false') {
				var index = foundUser.bookmarkedPosts.indexOf(req.body.postID);
				foundUser.bookmarkedPosts.splice(index, 1);
				foundUser.save(function (err, savedUser) {
					if (!err) {
						console.log('Unbookmarked Post removed from DB');
					}
				});
			}
		}
	});
});

module.exports = router;
