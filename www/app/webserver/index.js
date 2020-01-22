"use strict";

const express = require("express");
const cors = require("cors");

const {
  userRouter,
  hangoutRouter,
  authRouter,
  profileRouter,
  ratingsRouter,
<<<<<<< HEAD
=======
  attendanceRouter,
>>>>>>> 7d2037149a382239a0b2385a6e2ab981cc16d07f
  auxRouter
} = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", attendanceRouter);
app.use("/api", authRouter);
app.use("/api", auxRouter);
app.use("/api", hangoutRouter);
app.use("/api", profileRouter);
app.use("/api", ratingsRouter);
<<<<<<< HEAD
app.use("/api", auxRouter);
=======
app.use("/api", userRouter);
>>>>>>> 7d2037149a382239a0b2385a6e2ab981cc16d07f

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
