"use strict";

const Joi = require("@hapi/joi");
const uuidV4 = require("uuid/v4");
const mysqlPool = require("../../../database/mysql-pool");

const httpServerDomain = process.env.HTTP_SERVER_DOMAIN;
<<<<<<< HEAD

// async function validate(payload) {
//   const schema = joi.object({
//     title: joi
//       .string()
//       .trim()
//       .min(1)
//       .max(256)
//       .required(),
//     content: Joi.string()
//       .trim()
//       .min(10)
//       .max(65536)
//       .required(),
//     tags: Joi.array().required()
//   });

//   joi.assert(payload, schema);
// }
=======
/*
async function validate(payload) {
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(256)
      .required(),
    content: Joi.string()
      .trim()
      .min(10)
      .max(65536)
      .required()
  });

  Joi.assert(payload, schema);
}*/

/**
 * MODIFICAR VALIDACIONES SEGUN PAYLOAD REAL
 *
 */
>>>>>>> 2ec71d4000eb6a21b4456fbf47dc2761a965a0e1

async function createHangout(req, res, next) {
  const hangoutData = { ...req.body };
  const { organizatorId } = req.claims;
  /*
  try {
    await validate(hangoutData);
  } catch (e) {
    return res.status(400).send(e);
  }*/
  const now = new Date()
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");
  const { title, content } = hangoutData;

  const hangoutId = uuidV4();
  const hangout = {
    id: hangoutId,
    address,
    city,
    date,
    description,
    hour,
    photo_url,
    place,
    title,
    user_id: organizatorId,
    created_at: now
  };

  try {
    const connection = await mysqlPool.getConnection();
    try {
      const sqlCreateHangout = "INSERT INTO Events SET ?";
      await connection.query(sqlCreateHangout, hangout);

      const sqlUsers_Events = "INSERT INTO Users_Events SET ?";
      try {
        await connection.query(sqlUsers_Events, {
          id_users: organizatorId,
          event_id: hangoutId,
          attendance: 1
        });
      } catch (e) {
        console.error(e);
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
