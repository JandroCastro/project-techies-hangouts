"use strict";

const express = require("express");

const {
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
} = require("./routes");

const app = express();

app.use(express.json());
app.use("/api", attendanceRouter);
app.use("/api", authRouter);
app.use("/api", hangoutRouter);
app.use("/api", profileRouter);
app.use("/api", ratingsRouter);
<<<<<<< HEAD
app.use("/api", auxRouter);
=======
app.use("/api", userRouter);
>>>>>>> 4fcdb56ec01d4f472ad81eb7e90a7ee633f54b0a

let server = null;
async function listen(port) {
  if (server) {
    return server;
  }

  try {
    server = await app.listen(port);
    return server;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function close() {
  if (server) {
    await server.close();
    server = null;
  } else {
    console.error("Can not close a non started server");
  }
}

module.exports = {
  listen,
  close
};
