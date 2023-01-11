const mongoose = require('mongoose');
const commentSchema = require('./comment');

const blogPostSchema = new mongoose.Schema({
	title: String,
	image: String,
	post: String,
	author: String,
	authorID: mongoose.Schema.Types.ObjectId,
	date: Date,
	email: String,
	comments: [commentSchema],
	likes: {
		type: Number,
		default: 0
	},
	bookmarks: {
		type: Number,
		default: 0
	},
	approved: {
		type: Boolean,
		default: false
	},
	isDraft: {
		type: Boolean,
		default: false
	}
});

module.exports = blogPostSchema;
