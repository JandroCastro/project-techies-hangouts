"use strict";
const Joi = require("@hapi/joi");
const mySqlPool = require("../../../database/mysql-pool");

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

  let connection;
  try {
    connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT * FROM Events WHERE id = ?`;

    const [rows] = await connection.execute(sqlQuery, [hangoutId, userId]);
    connection.release();
    if (rows.length === 0) {
      return res.status(404).send();
    }
    return res.send(rows);
  } catch (e) {
    if (connection) {
      connection.release();
    }

    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getHangout;
