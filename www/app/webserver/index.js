"use strict";

const express = require("express");

const {
  userRouter,
  hangoutRouter,
  authRouter,
  profileRouter,
  ratingsRouter,
  attendanceRouter
} = require("./routes");

const app = express();

app.use(express.json());
app.use("/api", attendanceRouter);
app.use("/api", authRouter);
app.use("/api", hangoutRouter);
app.use("/api", profileRouter);
app.use("/api", ratingsRouter);
app.use("/api", userRouter);

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
