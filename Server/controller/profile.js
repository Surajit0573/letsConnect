
const Profile = require("../models/profile.js");
const User = require("../models/user.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bcryptRound = Number(process.env.BCRYPT_ROUND);
const jwtSecret = process.env.JWT_SECRET;
const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'None',
    secure: true,
}

module.exports.show = async (req, res, next) => {
    const { username } = req.params;
    console.log(username);
    try {
        const user = await User.findOne({ username: username }).populate('profile');
        if (!user) {
            return res.status(500).json({ ok: false, message: "Something went wrong" });
        }
        user.password = undefined;
        return res.status(200).json({ ok: true, message: `Welcome ${user.type}`, data: user });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, message: "Something went wrong" });
    }
};

module.exports.getProfile = async (req, res, next) => {
    const { id, type, isComplete } = res.payload;
    if (isComplete) {
        try {
            const user = await User.findById(id);
            if (user) {
                const profile = await Profile.findById(user.profile);
                return res.status(200).json({ ok: true, message: "Update Your Profile", data: profile });
            }
        } catch (e) {
            console.error(e);
            return res.status(500).json({ ok: false, message: "Server error" });
        }
    } else {
        return res.status(403).json({ ok: false, message: "Profile not complete" });
    }
};

module.exports.updateProfile = async (req, res, next) => {
    const { id, type, isComplete } = res.payload;
    const { fullname, dp, about, interests, links } = req.body;
    const newProfile = await Profile.create({ fullname, dp, about, interests, links });
    const user = await User.findByIdAndUpdate(id, { $set: { profile: newProfile._id, isComplete: true } }, { new: true });

    try {
        const user = await User.findById(id);
        const payload = {
            id: user._id,
            email: user.email,
            isComplete: user.isComplete
        }
        const token = jwt.sign(payload, jwtSecret, {
            expiresIn: '24h'
        });
        res.clearCookie("token", options);
        res.cookie("token", token, options);

        return res.status(200).json({ ok: true, message: "Profile updated successfully", data: newProfile });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
};

module.exports.dashboard = async (req, res, next) => {
    const { id, type, isComplete } = res.payload;
    try {
        const user = await User.findById(id).populate('profile');
        if (!user) {
            return res.status(500).json({ ok: false, message: "Something went wrong" });
        }
        user.password = undefined;
        return res.status(200).json({ ok: true, message: `Welcome ${type}`, data: user });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
};