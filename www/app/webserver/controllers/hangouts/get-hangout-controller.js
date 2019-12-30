"use strict";
const Joi = require("@hapi/joi");
const mysqlpool = require("../../../database/mysql-pool");

async function validate(payload) {
  const schema = Joi.object({
    noteId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required()
  });

  Joi.assert(payload, schema);
}

async function getHangout(req, res, next) {
  const { hangoutId } = req.params;
  const { userId } = req.claims;
  try {
    const payload = {
      hangoutId
    };
    await validate(payload);
  } catch (e) {
    return res.status(400).send(e);
  }
}
