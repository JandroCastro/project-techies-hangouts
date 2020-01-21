"use strict";

const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");
const createAttendance = require("../controllers/attendance/create-attendance");

const router = express.Router();

router.post("/hangouts/:hangoutId", checkUserSession, createAttendance);

module.exports = router;
