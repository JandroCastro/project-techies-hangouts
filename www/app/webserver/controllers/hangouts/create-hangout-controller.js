"use strict";

const Joi = require("@hapi/joi");
const uuidV4 = require("uuid/v4");
const mysqlPool = require("../../../database/mysql-pool");

const httpServerDomain = process.env.HTTP_SERVER_DOMAIN;

async function validate(payload) {
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .required(),
    description: Joi.string()
      .trim()
      .min(10)
      .max(65536)
      .required(),
    /*city: Joi.string().required(),*/
    address: Joi.string().required(),
    place: Joi.string().required(),
    date: Joi.date().required(),
    /*hour: Joi.string().required(),*/
    capacity: Joi.number()
      .required()
      .min(3)
  });

  Joi.assert(payload, schema);
}

/**
 * MODIFICAR VALIDACIONES SEGUN PAYLOAD REAL
 *
 */

async function createHangout(req, res, next) {
  const hangoutData = { ...req.body };
  const { userId } = req.claims;

  try {
    await validate(hangoutData);
  } catch (e) {
    return res.status(400).send(e);
  }
  const now = new Date()
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");
  const {
    title,
    description,
    /* city,*/
    address,
    place,
    date,
    /*hour,*/
    capacity
  } = hangoutData;

  const hangoutId = uuidV4();

  const hangout = {
    id: hangoutId,
    address,
    event_date: date,
    /*event_hour: hour,*/
    max_capacity: capacity,
    description,
    place,
    title,
    user_id: userId
    /*created_at: now*/
  };

  try {
    const connection = await mysqlPool.getConnection();
    try {
      const sqlCreateHangout = `INSERT INTO Events SET ?`;
      await connection.query(sqlCreateHangout, hangout);

      try {
        const sqlUsers_Events = `INSERT INTO Users_Events SET ?`;
        await connection.query(sqlUsers_Events, {
          id_users: userId,
          event_id: hangoutId,
          attendance: 1
        });
      } catch (e) {
        throw e;
      }
      connection.release();
      res.header("Location", `${httpServerDomain}/api/hangouts/${hangoutId}`);
      return res.status(201).send();
    } catch (e) {
      connection.release();
      throw e;
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = createHangout;
