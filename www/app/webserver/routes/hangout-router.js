"use strict";
const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");
const createHangout = require("../controllers/hangouts/create-hangout-controller");
const deleteHangout = require("../controllers/hangouts/delete-hangout-controller");
const getHangout = require("../controllers/hangouts/get-hangout-controller");
const getAllHangouts = require("../controllers/hangouts/get-all-hangouts-controller");
const getHangoutsByQuery = require("../controllers/hangouts/get-hangouts-by-query");
const router = express.Router();

router.post("/hangouts", checkUserSession, createHangout);
router.get("/hangouts", checkUserSession, getAllHangouts);
router.get("/hangouts/filter", checkUserSession, getHangoutsByQuery);
router.get("/hangouts/:hangoutId", checkUserSession, getHangout);
router.delete("/hangouts/:hangoutId", checkUserSession, deleteHangout);

module.exports = router;
