"use strict";

const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");
const acceptAttendance = require("../controllers/attendance/accept-attendance-controller");
const createAttendance = require("../controllers/attendance/create-attendance");
const rejectAttendance = require("../controllers/attendance/reject-attendance-controller");
const getPendingAttendance = require("../controllers/attendance/get-pending-attendance-controller");
const getAcceptedAttendance = require("../controllers/attendance/get-accepted-attendance-controller");

const router = express.Router();

router.post("/hangouts/:hangoutId", checkUserSession, createAttendance);
router.put("/hangouts/:hangoutId/accepted", checkUserSession, acceptAttendance);
router.put("/hangouts/:hangoutId/rejected", checkUserSession, rejectAttendance);
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
