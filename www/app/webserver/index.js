"use strict";

const express = require("express");

const { userRouter, hangoutRouter } = require("./routes");

const app = express();

app.use(express.json());
app.use("/api", userRouter);
app.use("/api", hangoutRouter);

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
