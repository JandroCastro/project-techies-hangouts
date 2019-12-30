"use strict";

const express = require("express");
const createProfile = require("../controllers/profile/create-profile-controller");
const checkUserSession = require("../controllers/user/check-user-session");
const router = express.Router();

router.post("/profiles", checkUserSession, createProfile);
//fata el get profile
module.exports = router;
