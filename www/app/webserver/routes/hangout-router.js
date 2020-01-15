"use strict";
const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");
const createHangout = require("../controllers/hangouts/create-hangout-controller");
const getHangout = require("../controllers/hangouts/get-hangout-controller");
const getAllHangouts = require("../controllers/hangouts/get-all-hangouts-controller");
const getHangoutByCity = require("../controllers/hangouts/get-hangout-by-city-controller");
const deleteHangout = require("../controllers/hangouts/delete-hangout-controller");

const router = express.Router();
router.post("/hangouts", checkUserSession, createHangout);
router.get("/hangouts/:hangoutId", checkUserSession, getHangout);
router.get("/hangouts", checkUserSession, getAllHangouts);
router.get("/hangouts/:cityId", checkUserSession, getHangoutByCity);
router.delete("/hangouts/:hangoutId", checkUserSession, deleteHangout);
module.exports = router;
