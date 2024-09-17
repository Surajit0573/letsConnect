const express = require("express");
const asyncWrap = require("../utils/asyncWrap.js");
const router = express.Router();
const uploadController = require("../controller/upload.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const videoUpload = multer({ dest: 'uploads/' });
router.route("/")
    .post(upload.single('file'), asyncWrap(uploadController.create)); //Create

router.route("/video")
    .post(videoUpload.single('file'), asyncWrap(uploadController.video)); //Create

router.route("/delete")
    .post(asyncWrap(uploadController.delete)); //Delete

module.exports = router;