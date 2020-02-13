"use strict";
const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");

const getAllCities = require("../controllers/aux/get-all-cities-controller");
const getAllThematics = require("../controllers/aux/get-all-thematics-controller");
const getCityName = require("../controllers/aux/get-city-by-id-controller");
const getThematicName = require("../controllers/aux/get-thematic-by-id-controller");

const router = express.Router();

router.get("/city", checkUserSession, getCityName);
router.get("/thematic", checkUserSession, getThematicName);
router.get("/allcities", checkUserSession, getAllCities);
router.get("/allthematics", checkUserSession, getAllThematics);

module.exports = router;
