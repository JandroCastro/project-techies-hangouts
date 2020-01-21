"use strict";

const userRouter = require("./user-router");
const hangoutRouter = require("./hangout-router");
const authRouter = require("./auth-router");
const profileRouter = require("./profile-router");
const ratingsRouter = require("./ratings-router");
const attendanceRouter = require("./attendance-router");

module.exports = {
  userRouter,
  hangoutRouter,
  authRouter,
  profileRouter,
  ratingsRouter,
  attendanceRouter
};
