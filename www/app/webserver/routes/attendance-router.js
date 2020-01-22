"use strict";

const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");
const createAttendance = require("../controllers/attendance/create-attendance");
const getPendingAttendance = require("../controllers/attendance/get-pending-attendance-controller");
const getAcceptedAttendance = require("../controllers/attendance/get-accepted-attendance-controller");
const router = express.Router();

router.post("/hangouts/:hangoutId", checkUserSession, createAttendance);
router.get(
  "/hangouts/pending/:hangoutId",
  checkUserSession,
  getPendingAttendance
);
router.get(
  "/hangouts/accepted/:hangoutId",
  checkUserSession,
  getAcceptedAttendance
);
module.exports = router;
