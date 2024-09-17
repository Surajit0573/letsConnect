const User = require("../models/user.js");
const Profile = require('../models/profile.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcryptRound = Number(process.env.BCRYPT_ROUND);
const jwtSecret = process.env.JWT_SECRET;

const options = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  httpOnly: true,
  sameSite: 'None',
  secure: true,
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  }
});

const sendOTPEmail = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };
  return transporter.sendMail(mailOptions);
};

module.exports.addFriend = async (req, res) => {
  try {
    const { id } = res.payload; 
    const { friendId } = req.body;

    // Fetch both the requesting user and the potential friend
    const friend = await User.findById(friendId);
    const user = await User.findById(id);

    if (!friend || !user) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }

    // Check if the friend request is already sent or already friends
    if (friend.sentRequests.includes(id) || friend.receivedRequests.includes(id) || friend.friends.includes(id)) {
      return res.status(400).json({ ok: false, message: 'Friend request already sent or already friends' });
    }

    // Add friend request to the user's sentRequests and friend's receivedRequests
    user.sentRequests.push(friendId);
    friend.receivedRequests.push(id);

    await user.save();
    await friend.save();

    return res.json({ ok: true, message: 'Friend request sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};

module.exports.unfriend = async (req, res) => {
  try {
    const { id } = res.payload;
    const { friendId } = req.body;

    // Fetch both the requesting user and the friend to be unfriended
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }

    // Remove friend from both users' friends list
    user.friends = user.friends.filter(friend => friend.toString() !== friendId);
    friend.friends = friend.friends.filter(friend => friend.toString() !== id);

    await user.save();
    await friend.save();

    return res.json({ ok: true, message: 'Unfriended successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};


module.exports.confirmFriendRequest = async (req, res) => {
  try {
    const { id } = res.payload; 
    const { friendId } = req.body; 

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }

    // Check if the friend request exists
    if (!user.receivedRequests.includes(friendId)) {
      return res.status(400).json({ ok: false, message: 'No pending friend request' });
    }

    // Move from received/sent requests to friends
    user.receivedRequests = user.receivedRequests.filter(request => request.toString() !== friendId);
    friend.sentRequests = friend.sentRequests.filter(request => request.toString() !== id);

    user.friends.push(friendId);
    friend.friends.push(id);

    await user.save();
    await friend.save();

    return res.json({ ok: true, message: 'Friend request confirmed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};

module.exports.rejectFriendRequest = async (req, res) => {
  try {
    const { id } = res.payload;
    const { friendId } = req.body;

    // Fetch both users from the database
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    // Check if both users exist
    if (!user || !friend) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }

    // Check if the friend request exists in the user's received requests
    if (!user.receivedRequests.includes(friendId)) {
      return res.status(400).json({ ok: false, message: 'No pending friend request from this user' });
    }

    // Remove the friend request from the receivedRequests array
    user.receivedRequests = user.receivedRequests.filter(request => request.toString() !== friendId);
    friend.sentRequests = friend.sentRequests.filter(request => request.toString() !== id);

    // Save both users after modifying the requests
    await user.save();
    await friend.save();

    return res.json({ ok: true, message: 'Friend request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
};



module.exports.withdrawFriendRequest = async (req, res) => {
  try {
    const { id } = res.payload; 
    const { friendId } = req.body;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }

    // Remove the friend request from both sides
    user.sentRequests = user.sentRequests.filter(request => request.toString() !== friendId);
    friend.receivedRequests = friend.receivedRequests.filter(request => request.toString() !== id);

    await user.save();
    await friend.save();

    return res.json({ ok: true, message: 'Friend request withdrawn' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};


module.exports.getusers = async (req, res) => {
  try {
    const { id } = res.payload;
    const iam = await User.findById(id).populate('friends');

    // Fetch all users except the requesting user
    let users = await User.find({ _id: { $ne: id } }).populate('profile').populate('friends');

    // Map users to include necessary properties for the frontend
    users = users.map(user => {
      // Convert ObjectIds to strings for comparison
      const iamFriends = iam.friends.map(friend => friend._id.toString());
      const userFriends = user.friends.map(friend => friend._id.toString());

      // Find mutual friends by checking if the user's friends are in iam's friends
      const mutualFriends = userFriends.filter(friendId => iamFriends.includes(friendId));

      return {
        _id: user._id.toString(),
        username: user.username,
        profile: user.profile,
        mutualFriends,
        isFriend: iamFriends.includes(user._id.toString()), // Check if the user is already a friend
        isSent: iam.sentRequests.map(reqId => reqId.toString()).includes(user._id.toString()), // Check if a friend request was sent
        isReceived: iam.receivedRequests.map(reqId => reqId.toString()).includes(user._id.toString()) // Check if a friend request was received
      };
    });

    res.json({ ok: true, message: "Users fetched successfully", data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};



module.exports.friends = async (req, res) => {
  try {
    const { id } = res.payload;
    const user = await User.findById(id).populate({
      path: 'friends',
      populate: { path: 'profile', model: 'Profile' }
    });

    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }

    // Map friends to include necessary properties for frontend
    let friends = user.friends.map(friend => {
      let mutualFriends = friend.friends.filter(f => user.friends.includes(f._id));
      return {
        _id: friend._id,
        username: friend.username,
        profile: friend.profile,
        mutualFriends,
        isFriend: true,
        isSent: false,
        isReceived: false
      };
    });

    res.json({ ok: true, message: "Friends fetched successfully", data: friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};

module.exports.sentRequests = async (req, res) => {
  try {
    const { id } = res.payload;
    const user = await User.findById(id).populate({
      path: 'sentRequests',
      populate: { path: 'profile', model: 'Profile' }
    });

    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }

    // Map sent requests to include necessary properties for frontend
    let sentRequests = user.sentRequests.map(request => {
      let mutualFriends = request.friends.filter(f => user.friends.includes(f._id));
      return {
        _id: request._id,
        username: request.username,
        profile: request.profile,
        mutualFriends,
        isFriend: false,
        isSent: true,
        isReceived: false
      };
    });

    res.json({ ok: true, message: "Sent requests fetched successfully", data: sentRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};

module.exports.receivedRequests = async (req, res) => {
  try {
    const { id } = res.payload;
    const user = await User.findById(id).populate({
      path: 'receivedRequests',
      populate: { path: 'profile', model: 'Profile' }
    });

    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }

    // Map sent requests to include necessary properties for frontend
    let receivedRequests = user.receivedRequests.map(request => {
      let mutualFriends = request.friends.filter(f => user.friends.includes(f._id));
      return {
        _id: request._id,
        username: request.username,
        profile: request.profile,
        mutualFriends,
        isFriend: false,
        isSent: false,
        isReceived: true
      };
    });

    res.json({ ok: true, message: "Sent requests fetched successfully", data: receivedRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};

module.exports.recommendUsers = async (req, res) => {
  try {
    const { id } = res.payload;
    const user = await User.findById(id)
      .populate('friends', '_id')
      .populate('sentRequests', '_id')
      .populate('receivedRequests', '_id');

    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }

    // Convert friends, sentRequests, and receivedRequests to arrays of strings for comparison
    const friendsIds = user.friends.map(friend => friend._id.toString());
    const sentRequestsIds = user.sentRequests.map(request => request._id.toString());
    const receivedRequestsIds = user.receivedRequests.map(request => request._id.toString());

    // Get a list of all users, excluding the current user
    const allUsers = await User.find({ _id: { $ne: id } })
      .populate('friends', '_id fullname username dp')  // Populate necessary fields for friends
      .select('_id username profile dp friends');  // Select the required fields from the User model

    // Filter users
    const recommendedUsers = allUsers.filter(otherUser => {
      const otherUserId = otherUser._id.toString();

      const isAlreadyFriend = friendsIds.includes(otherUserId);
      const hasSentRequest = sentRequestsIds.includes(otherUserId);
      const hasReceivedRequest = receivedRequestsIds.includes(otherUserId);

      // Return only users with no prior connection (not friends, no sent/received request)
      return !isAlreadyFriend && !hasSentRequest && !hasReceivedRequest;
    });

    // Calculate mutual friends and create recommendation list
    let recommendations = recommendedUsers.map(otherUser => {
      const mutualFriends = otherUser.friends.filter(friend =>
        friendsIds.includes(friend._id.toString())
      );

      return {
        _id: otherUser._id,
        username: otherUser.username,
        profile: otherUser.profile,
        dp: otherUser.dp, // Display picture is now available
        mutualFriends,
        mutualFriendsCount: mutualFriends.length, // Number of mutual friends
        isFriend: false,
        isSent: false
      };
    });

    // Sort users by the number of mutual friends in descending order
    recommendations = recommendations.sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount);

    res.json({
      ok: true,
      message: "Recommended users fetched successfully",
      data: recommendations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};


module.exports.sameInterest = async (req, res) => {
  try {
    const { id } = res.payload;
    const user = await User.findById(id)
      .populate('friends', '_id')
      .populate('sentRequests', '_id')
      .populate('receivedRequests', '_id')
      .populate('profile');  // Populate the profile for interests

    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found' });
    }

    // Get user's interests, default to an empty array if not found
    const userInterests = (user.profile && user.profile.interests) ? user.profile.interests : [];

    // Convert friends, sentRequests, and receivedRequests to arrays of strings for comparison
    const friendsIds = user.friends.map(friend => friend._id.toString());
    const sentRequestsIds = user.sentRequests.map(request => request._id.toString());
    const receivedRequestsIds = user.receivedRequests.map(request => request._id.toString());

    // Get a list of all users, excluding the current user
    const allUsers = await User.find({ _id: { $ne: id } })
      .populate('friends', '_id fullname username dp')  // Populate friends' details
      .populate('profile')  // Populate the profile for interests
      .select('_id username profile dp friends');  // Select fields for other users

    // Filter users based on shared interests
    const recommendedUsers = allUsers.filter(otherUser => {
      const otherUserId = otherUser._id.toString();

      // Get other user's interests, default to an empty array if not found
      const otherUserInterests = (otherUser.profile && otherUser.profile.interests) ? otherUser.profile.interests : [];

      // Check if there is at least one common interest
      const hasCommonInterest = userInterests.some(interest => otherUserInterests.includes(interest));

      // Check if already a friend or if a request is already sent or received
      const isAlreadyFriend = friendsIds.includes(otherUserId);
      const hasSentRequest = sentRequestsIds.includes(otherUserId);
      const hasReceivedRequest = receivedRequestsIds.includes(otherUserId);

      // Return users that have a common interest and no prior connection
      return hasCommonInterest && !isAlreadyFriend && !hasSentRequest && !hasReceivedRequest;
    });

    // Calculate the number of shared interests
    let recommendations = recommendedUsers.map(otherUser => {
      const otherUserInterests = (otherUser.profile && otherUser.profile.interests) ? otherUser.profile.interests : [];
      const sharedInterests = userInterests.filter(interest => otherUserInterests.includes(interest));

      return {
        _id: otherUser._id,
        username: otherUser.username,
        dp: otherUser.dp,  // Added dp for display picture
        profile: otherUser.profile,
        sharedInterests,
        sharedInterestsCount: sharedInterests.length,  // Number of shared interests
        isFriend: false,
        isSent: false
      };
    });

    // Sort users by the number of shared interests in descending order
    recommendations = recommendations.sort((a, b) => b.sharedInterestsCount - a.sharedInterestsCount);

    res.json({
      ok: true,
      message: "Recommended users with similar interests fetched successfully",
      data: recommendations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};


module.exports.deleteAccount = async (req, res) => {
  const { id, type, isComplete } = res.payload;
  try {
    const user = await User.findById(id);
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ ok: false, message: "User not found", data: null });
    }
    if (isComplete) {
      await Profile.findByIdAndDelete(user.profile).then((p) => {
        console.log(`Profile Deleted`);
      }).catch((err) => {
        console.error(`Error deleting Profile: ${err}`);
      });
      user.isComplete = false;
      user.profile = null;
    }
    await user.save();
    await User.findByIdAndDelete(id);
    res.clearCookie("token", options);
    return res.status(400).json({ ok: true, message: "Your account have been removed" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}


module.exports.isLoggedin = async (req, res) => {
  let { id } = res.payload;
  if (!id) {
    console.error("User not logged in");
    return res.status(401).json({ ok: false, message: "User not logged in" });
  }
  const user = await User.findById(id);
  if (!user) {
    console.error("User not found");
    return res.status(404).json({ ok: false, message: "User not found" });
  }
  return res.json({ ok: true, message: "User is Logged In" });
}

module.exports.getInfo = async (req, res) => {
  let { id } = res.payload;
  if (!id) {
    console.error("User not logged in");
    return res.status(401).json({ ok: false, message: "User not logged in" });
  }
  const user = await User.findById(id).populate('profile');
  if (!user) {
    console.error("User not found");
    return res.status(404).json({ ok: false, message: "User not found" });
  }
  let dp = null;
  if (user.isComplete) {
    dp = user.profile.dp;
  }
  return res.json({ ok: true, message: "User is Logged In", isTeacher: user.type == "instructor", isComplete: user.isComplete, dp: dp });
}


module.exports.getEmail = async (req, res) => {
  let { id } = res.payload;
  if (!id) {
    return res.status(401).json({ ok: false, message: "You have to signup first", redirect: '/signup' });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ ok: false, message: "User not found", redirect: '/signup' });
  }
  if (user.verify) {
    return res.status(400).json({ ok: false, message: "You have already verified your email" });
  }
  if (user.otp && user.otpExpiry && user.otpExpiry >= Date.now()) {
    return res.status(400).json({ ok: true, message: "OTP already sent. Please check your email", data: user.email });
  }
  // Generate OTP and send email
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  const otpExpiry = Date.now() + 600000; // OTP valid for 10 minutes
  await sendOTPEmail(user.email, otp);
  const hashOtp = await bcrypt.hash(`${otp}`, bcryptRound);
  user.otp = hashOtp;
  user.otpExpiry = otpExpiry;
  await user.save();
  return res.json({ ok: true, message: "OTP sent to your email. Please verify.", data: user.email });

}

module.exports.verifyEmail = async (req, res) => {
  let { id } = res.payload;
  const { otp } = req.body;
  if (!id) {
    return res.status(401).json({ ok: false, message: "You have to signup first", redirect: '/signup' });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ ok: false, message: "User not found", redirect: '/signup' });
  }
  if (!(user.otp && user.otpExpiry && user.otpExpiry >= Date.now())) {
    return res.status(400).json({ ok: true, message: "OTP Expires, Resend OTP" });
  }
  const isMatch = await bcrypt.compare(otp, user.otp);
  if (!isMatch) {
    console.error("Incorrect OTP");
    return res.status(401).json({ ok: false, message: "Incorrect OTP" });

  }
  user.otp = undefined;
  user.otpExpiry = undefined;
  user.verify = true;
  await user.save();
  return res.json({ ok: true, message: "Email is verified" });

}


module.exports.signup = async (req, res) => {
  let { username, password, email } = req.body;

  //Varifications
  if (!email || !username || !password) {
    return res.status(400).json({ ok: false, message: "Pleaase Provide all the required information" });

  }
  if (password.length < 8) {
    return res.status(400).json({ ok: false, message: "Password should be at least 8 characters long" });

  }
  if (username.length < 3) {
    return res.status(400).json({ ok: false, message: "Username should be at least 3 characters long" });

  }
  if (email.indexOf("@") === -1) {
    return res.status(400).json({ ok: false, message: "Please enter a valid email address" });

  }

  //Email already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.error("Email is already registered");
    return res.status(400).json({ ok: false, message: "Email is already registered" });

  }
  //unique username
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    console.error("Username is already registered");
    return res.status(400).json({ ok: false, message: "Username is not available" });

  }


  try {
    //Hash PassWord
    const hashPassword = await bcrypt.hash(password, bcryptRound);
    //Create a new user
    const user = await User.create({
      username,
      password: hashPassword,
      email
    });
    const payload = {
      id: user._id,
      email: user.email,
      isComplete: user.isComplete,
    }
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '24h'
    });
    user.password = undefined;
    res.clearCookie("token", options);
    res.cookie("token", token, options);
    return res.status(201).json({ ok: true, message: "Signup successful, Now Varify your Email", response: user });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Something went wrong while signuping" });

  }


};


module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  //Varifications
  if (!email || !password) {
    console.error("Please enter all required information");
    return res.status(400).json({ ok: false, message: "Pleaase Provide all the required information" });

  }
  //Check if user exists
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ ok: false, message: "User not found" });

    }
    //Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Incorrect password");
      return res.status(401).json({ ok: false, message: "Incorrect password" });

    }
    const payload = {
      id: user._id,
      email: user.email,
      isComplete: user.isComplete,
    }
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '24h'
    });
    res.clearCookie("token", options);
    res.cookie("token", token, options);

    //check if email verified or not 
    if (!user.verify) {
      console.error("Email is not verified");
      return res.status(401).json({ ok: false, message: "Email is not verified", redirect: '/verifyEmail' });
    }

    return res.status(200).json({ ok: true, message: "Successfully Logged in!" });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong while login" });
  }


  // return res.status(200).json({massege: "Successfully logged in", ok: true, });


}

module.exports.logout = (req, res) => {
  res.clearCookie("token", options);
  res.status(201).json({ status: 200, massege: "Successfully logged out", ok: true, });

};


module.exports.changePass = async (req, res) => {
  const { id } = res.payload;
  try {
    const user = await User.findById(id);
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ ok: false, message: "User not found", data: null });
    }
    return res.status(200).json({ ok: true, message: "successfully found user", data: user.username });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ ok: false, message: "Something went wrong" });
  }

};


module.exports.updatePass = async (req, res) => {
  const { id } = res.payload;
  const { currPass, newPass } = req.body;
  //Varifications
  if (!currPass || !newPass) {
    console.error("Please enter all required information");
    return res.status(400).json({ ok: false, message: "Pleaase Provide all the required information" });

  }
  //Check if user exists
  const user = await User.findById(id);
  if (!user) {
    console.error("User not found");
    return res.status(404).json({ ok: false, message: "User not found", redirect: "/login" });

  }
  //Check if password is correct
  const isMatch = await bcrypt.compare(currPass, user.password);
  if (!isMatch) {
    console.error("Incorrect password");
    return res.status(401).json({ ok: false, message: "Incorrect password" });

  }
  try {
    //Hash PassWord
    const hashPassword = await bcrypt.hash(newPass, bcryptRound);
    //Update password
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({ ok: true, message: "Password updated successfully" });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ ok: false, message: "Something went wrong while updating password" });
  }

};
