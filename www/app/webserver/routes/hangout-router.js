"use strict";
const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");
const createHangout = require("../controllers/hangouts/create-hangout-controller");
const getHangout = require("../controllers/hangouts/get-hangout-controller");

const router = express.router();
router.post("/hangouts", checkUserSession, createHangout);
router.get("/hangouts/:hangoutId", checkUserSession, getHangout);

module.exports = router;
