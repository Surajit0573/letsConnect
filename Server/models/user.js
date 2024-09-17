const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Profile = require('./profile');

const User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    verify: {
        type: Boolean,
        default: false
    },
    otp: { type: String },
    otpExpiry: { type: Date },
    isComplete: {
        type: Boolean,
        default: false
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    friends: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    sentRequests: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    receivedRequests: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    }


});

module.exports = mongoose.model('User', User);