const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require("./user.js");


const profileSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    dp: { type: String, default: '' },
    interests: [{ type: String }],
    about: { type: String, required: true },
    links: {
        website: { type: String, required: true },
        twitter: { type: String, required: true },
        linkedin: { type: String, required: true },

    }
});
const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;