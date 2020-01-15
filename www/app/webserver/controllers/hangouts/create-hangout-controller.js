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
    address: Joi.string().required(),
    place: Joi.string().required(),
    city: Joi.string(),
    date: Joi.date().required(),
    hour: Joi.string(),
    photo_url: Joi.string(),
    capacity: Joi.number()
      .required()
      .min(3)
  });

  Joi.assert(payload, schema);
}

async function createHangout(req, res, next) {
  const hangoutData = { ...req.body };
  const { userId } = req.claims;

  try {
    await validate(hangoutData);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
  const now = new Date()
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");

  const {
    title,
    description,
    address,
    place,
    city,
    date,
    hour,
    photo_url,
    capacity
  } = hangoutData;

  const hangoutId = uuidV4();
  let connection;
  try {
    connection = await mysqlPool.getConnection();
    const consultCityIdQuery = `SELECT *
      FROM Cities
      WHERE
        name = ?`;
    const [row] = await connection.query(consultCityIdQuery, city);
    connection.release();

    if (row.length === 0) {
      return res.status(400).send();
    }

    const hangout = {
      id: hangoutId,
      address,
      event_date: date,
      max_capacity: capacity,
      description,
      place,
      title,
      photo_url,
      city_id: row[0].id,
      event_hour: hour,
      created_at: now,
      user_id: userId
    };

    connection = await mysqlPool.getConnection();
    try {
      const sqlCreateHangout = `INSERT INTO Events SET ?`;
      await connection.query(sqlCreateHangout, hangout);

      try {
        const sqlUpdateAttendance = `INSERT INTO Attendance SET ?`;
        await connection.query(sqlUpdateAttendance, {
          id_users: userId,
          event_id: hangoutId,
          request_status: 2
        });
      } catch (e) {
        throw e;
      }
      connection.release();
      res.header("Location", `${httpServerDomain}/api/hangouts/${hangoutId}`);
      return res.status(201).send(hangoutId);
      /**
       * Devuelve hangoutId para meter en variable de entorno
       * de Postman
       */
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
