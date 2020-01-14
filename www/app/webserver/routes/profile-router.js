"use strict";

const express = require("express");
const createProfile = require("../controllers/profile/create-profile-controller");
const checkUserSession = require("../controllers/user/check-user-session");
const getProfile = require("../controllers/profile/get-profile-controller");
const router = express.Router();

router.post("/profiles", checkUserSession, createProfile);
router.get("/profiles/:profileId", checkUserSession, getProfile);
module.exports = router;
