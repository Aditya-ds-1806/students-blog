const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const postSchema = require('../models/post');
const userSchema = require('../models/user');

const currentUser = require('../middleware/index');

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

router.post('/blogs/post/newDraft', currentUser.isLoggedIn, function (req, res) {
    // might be useful somewhere
    // const backURL = req.header('Referer') || '/';
    // console.log(backURL);
    var newDraft = {
        title: req.body.title,
        image: req.body.image,
        post: req.body.post,
        author: req.user.username,
        authorID: req.user.id,
        date: Date(),
        email: req.user.email,
        approved: false,
        isDraft: true
    };
    if (req.query.draftID === undefined) {
        // User is trying to create new draft
        console.log("User is creating new draft");
        Post.create(newDraft, function (err, newDraft) {
            if (err) {
                console.log(err);
            } else {
                console.log('Draft has been created!');
                User.findOne({ _id: req.user.id }, function (err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        user.drafts.push(newDraft.id);
                        user.save(function (err, savedUser) {
                            if (err) {
                                console.log(err);
                                req.flash('error', 'Something went wrong while saving the post!');
                                res.redirect('/');
                            } else {
                                console.log('Drafts array updated succesfully');
                                req.flash('success', 'Your draft has been saved.');
                                res.redirect('/');
                            }
                        });
                    }
                });
            }
        });
    } else {
        // User is updating existing draft
        Post.findOneAndUpdate({ _id: req.query.draftID }, newDraft, { useFindAndModify: false }, function (err, doc) {
            if (err) {
                console.log(err);
                req.flash('error', 'Something went wrong while updating the draft');
                res.redirect('/');
            } else {
                console.log("draft updated succesfully!");
                req.flash('success', 'Your draft has been updated succesfully');
                res.redirect('/');
            }
        });
    }
});

module.exports = router;