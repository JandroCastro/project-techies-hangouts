"use strict";

const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");
const acceptAttendance = require("../controllers/attendance/accept-attendance");
const createAttendance = require("../controllers/attendance/create-attendance");
const rejectAttendance = require("../controllers/attendance/reject-attendance");

const router = express.Router();

router.post("/hangouts/:hangoutId", checkUserSession, createAttendance);
router.put("/hangouts/:hangoutId/accepted", checkUserSession, acceptAttendance);
router.put("/hangouts/:hangoutId/rejected", checkUserSession, rejectAttendance);

module.exports = router;
