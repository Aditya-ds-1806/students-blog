const mongoose = require('mongoose');
var schemaobj = {
	user: String,
	userID: mongoose.Schema.Types.ObjectId,
	text: String,
	image: String,
	date: Date
};

const commentSchema = new mongoose.Schema(schemaobj);

module.exports = commentSchema;
