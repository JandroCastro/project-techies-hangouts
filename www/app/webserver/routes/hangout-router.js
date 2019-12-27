"use strict";
const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");
const createHangout = require("../controllers/hangouts/create-hangout-controller");
const getHangout = require("../controllers/hangouts/get-hangout-controller");

const router = express.Router();
router.post("/hangouts", checkUserSession, createHangout);

module.exports = router;
