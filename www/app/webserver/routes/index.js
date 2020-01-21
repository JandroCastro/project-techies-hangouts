"use strict";

const userRouter = require("./user-router");
const hangoutRouter = require("./hangout-router");
const authRouter = require("./auth-router");
const profileRouter = require("./profile-router");
const ratingsRouter = require("./ratings-router");
const auxRouter = require("./aux-router");

module.exports = {
  userRouter,
  hangoutRouter,
  authRouter,
  profileRouter,
  ratingsRouter,
  auxRouter
};
