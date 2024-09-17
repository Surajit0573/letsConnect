const express = require("express");
const asyncWrap = require("../utils/asyncWrap.js");
const router = express.Router({ mergeParams: true });

const { validateuser, varifyJWT, verifyEmail } = require("../middleware.js");
const userContoller = require("../controller/user.js");

// Email verification routes
router.get('/getEmail', verifyEmail, asyncWrap(userContoller.getEmail));
router.post('/verifyEmail', verifyEmail, asyncWrap(userContoller.verifyEmail));

// User authentication and management routes
router.get('/', varifyJWT, asyncWrap(userContoller.isLoggedin));
router.delete('/', varifyJWT, asyncWrap(userContoller.deleteAccount));
router.post("/signup", validateuser, asyncWrap(userContoller.signup));
router.post("/login", asyncWrap(userContoller.login));
router.get("/logout", varifyJWT, userContoller.logout);
router.get('/getInfo', varifyJWT, asyncWrap(userContoller.getInfo));
router.get('/signOutTeach', varifyJWT, asyncWrap(userContoller.signOutTeach));

// User management routes
router.get('/getAllUser', varifyJWT, asyncWrap(userContoller.getusers));

// Friend-related routes
router.get('/friends', varifyJWT, asyncWrap(userContoller.friends));
router.get('/sentRequests', varifyJWT, asyncWrap(userContoller.sentRequests));
router.get('/receivedRequests', varifyJWT, asyncWrap(userContoller.receivedRequests));
router.get('/recommendation', varifyJWT, asyncWrap(userContoller.recommendUsers));
router.get('/sameInterest', varifyJWT, asyncWrap(userContoller.sameInterest));
router.post('/addFriend', varifyJWT, asyncWrap(userContoller.addFriend));

// New routes for friend management
router.post('/unfriend', varifyJWT, asyncWrap(userContoller.unfriend));
router.post('/confirmFriendRequest', varifyJWT, asyncWrap(userContoller.confirmFriendRequest));
router.post('/rejectFriendRequest', varifyJWT, asyncWrap(userContoller.rejectFriendRequest));
router.post('/withdrawFriendRequest', varifyJWT, asyncWrap(userContoller.withdrawFriendRequest));

// Password management routes
router.route("/changePass")
  .get(varifyJWT, asyncWrap(userContoller.changePass))
  .post(varifyJWT, asyncWrap(userContoller.updatePass));

module.exports = router;
