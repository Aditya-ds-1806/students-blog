const moment = require('moment');
const mongoose = require('mongoose');
const router = require('express').Router();
const userSchema = require('../models/user');

const User = mongoose.model('User', userSchema);

router.post('/setStatus', function (req, res) {
    User.findOne({ _id: req.user.id }, function (err, user) {
        const now = moment();
        if (typeof user.lastSeen !== 'undefined') {
            user.lastSeen = now;
            user.save();
        } else {
            user.lastSeen = moment().format();
            user.save();
        }
    });
    res.sendStatus(200);
});

module.exports = router;