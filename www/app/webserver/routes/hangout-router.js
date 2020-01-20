"use strict";
const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");
const createHangout = require("../controllers/hangouts/create-hangout-controller");
const deleteHangout = require("../controllers/hangouts/delete-hangout-controller");
const getHangout = require("../controllers/hangouts/get-hangout-controller");
const getAllHangouts = require("../controllers/hangouts/get-all-hangouts-controller");
/*const getHangoutByCity = require("../controllers/hangouts/get-hangout-by-city-controller");
const getHangoutByThematic = require("../controllers/hangouts/get-hangout-by-thematic-controller");*/
const getHangoutsByQuery = require("../controllers/hangouts/get-hangouts-by-query");

const router = express.Router();
router.post("/hangouts", checkUserSession, createHangout);
router.get("/hangouts", checkUserSession, getAllHangouts);
router.get("/hangouts/:hangoutId", checkUserSession, getHangout);
router.get(
  "/hangouts/filter?city=:cityName&thematics=:thematicName&dates=:datesBetween",
  checkUserSession,
  getHangoutsByQuery
);
/*router.get("/hangouts/:cityName", checkUserSession, getHangoutByCity);
router.get(
  "/hangouts/thematic/:thematicName",
  checkUserSession,
  getHangoutByThematic
);*/
router.delete("/hangouts/:hangoutId", checkUserSession, deleteHangout);
module.exports = router;
