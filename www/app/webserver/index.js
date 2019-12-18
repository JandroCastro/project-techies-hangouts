"use strict";

const express = require("express");

/*
aqui tenemos que importar el index de routes
y debajo del json utilizarlas(app.use...)
*/

const app = express();

app.use(express.json());

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
