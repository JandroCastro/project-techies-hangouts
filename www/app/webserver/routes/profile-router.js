"use strict";

const express = require("express");
const updateProfile = require("../controllers/profile/update-profile-controller");
const checkUserSession = require("../controllers/user/check-user-session");
const getProfile = require("../controllers/profile/get-profile-controller");
const router = express.Router();

router.put("/profiles/:profileId", checkUserSession, updateProfile);
router.get("/profiles/:profileId", checkUserSession, getProfile);
module.exports = router;
