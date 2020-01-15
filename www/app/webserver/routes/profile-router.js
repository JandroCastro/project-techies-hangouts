"use strict";

const express = require("express");
const multer = require("multer");
const updateProfile = require("../controllers/profile/update-profile-controller");
const checkUserSession = require("../controllers/user/check-user-session");
const getProfile = require("../controllers/profile/get-profile-controller");
const uploadAvatar = require("../controllers/profile/upload-avatar-controller");
const upload = multer();
const router = express.Router();

router.put(
  "/profiles/:profileId",
  checkUserSession,
  upload.single(`avatar`),
  uploadAvatar
);
router.put("/profiles/:profileId", checkUserSession, updateProfile);
router.get("/profiles/:profileId", checkUserSession, getProfile);
module.exports = router;
