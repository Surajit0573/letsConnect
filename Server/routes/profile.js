const express = require("express");
const asyncWrap = require("../utils/asyncWrap.js");
const router = express.Router({ mergeParams: true });


const { validateprofile, varifyJWT } = require("../middleware.js");
const profileContoller = require("../controller/profile.js");

//Signup

router.route("/")
    .get(varifyJWT, asyncWrap(profileContoller.getProfile))
    .post(varifyJWT,validateprofile, asyncWrap(profileContoller.updateProfile));

router.get("/dashboard", varifyJWT, asyncWrap(profileContoller.dashboard));

router.get("/:username", asyncWrap(profileContoller.show));
module.exports = router;