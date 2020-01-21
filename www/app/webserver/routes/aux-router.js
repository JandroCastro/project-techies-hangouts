"use strict";
const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");

const getAllCities = require("../controllers/hangouts/get-all-cities-controller");
const getAllThematics = require("../controllers/hangouts/get-all-thematics-controller");

const router = express.Router();

router.get("/cities", checkUserSession, getAllCities);
router.get("/thematics", checkUserSession, getAllThematics);

module.exports = router;
