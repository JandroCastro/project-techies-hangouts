"use strict";

const express = require("express");
const checkUserSession = require("../controllers/user/check-user-session");
const createRating = require("../controllers/ratings/create-rating-controller");
const router = express.Router();

router.post("/hangouts/:hangoutId/rating", checkUserSession, createRating);

module.exports = router;
