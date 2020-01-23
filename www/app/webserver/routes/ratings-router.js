"use strict";

const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");
const createRating = require("../controllers/ratings/create-rating-controller");
const getRating = require("../controllers/ratings/get-rating-by-id");
const router = express.Router();

router.post("/rating/:hangoutId", checkUserSession, createRating);
router.get("/rating/:userId", checkUserSession, getRating);

module.exports = router;
