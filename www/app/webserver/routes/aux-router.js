"use strict";
const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");

const getAllCities = require("../controllers/aux/get-all-cities-controller");
const getAllThematics = require("../controllers/aux/get-all-thematics-controller");

const router = express.Router();

router.get("/cities", checkUserSession, getAllCities);
router.get("/thematics", checkUserSession, getAllThematics);

module.exports = router;
