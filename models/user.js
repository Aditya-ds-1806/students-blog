const mongoose = require('mongoose');
const blogPostSchema = require('./post');
const commentSchema = require('./comment');

const Post = mongoose.model('Post', blogPostSchema);

const userSchema = new mongoose.Schema({
	googleID: String,
	username: String,
	image: String,
	email: String,
	description: {
		type: String,
		default: 'Apparently, this user prefers to keep an air of mystery about them.',
		maxlength: 100
	},
	lastSeen: Date,
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post'
		}
	],
	pendingPosts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post'
		}
	],
	likedPosts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post'
		}
	],
	bookmarkedPosts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post'
		}
	],
	drafts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
	}]
});

module.exports = userSchema;
