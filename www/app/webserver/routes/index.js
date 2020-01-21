"use strict";

const userRouter = require("./user-router");
const hangoutRouter = require("./hangout-router");
const authRouter = require("./auth-router");
const profileRouter = require("./profile-router");
const ratingsRouter = require("./ratings-router");
<<<<<<< HEAD
const auxRouter = require("./aux-router");
=======
const attendanceRouter = require("./attendance-router");
>>>>>>> 4fcdb56ec01d4f472ad81eb7e90a7ee633f54b0a

module.exports = {
  userRouter,
  hangoutRouter,
  authRouter,
  profileRouter,
  ratingsRouter,
<<<<<<< HEAD
  auxRouter
=======
  attendanceRouter
>>>>>>> 4fcdb56ec01d4f472ad81eb7e90a7ee633f54b0a
};
