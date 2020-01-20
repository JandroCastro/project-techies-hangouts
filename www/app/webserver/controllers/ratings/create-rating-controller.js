"use strict";

const Joi = require("@hapi/joi");
const uuidV4 = require("uuid/v4");
const mysqlPool = require("../../../database/mysql-pool");

const httpServerDomain = process.env.HTTP_SERVER_DOMAIN;

async function validate(payload) {
  const schema = Joi.object({
    rating: Joi.number().required(),
    id_rated: Joi.string()
  });

  Joi.assert(payload, schema);
}

async function createRating(req, res, next) {
  const ratingData = req.body;

  const userId = req.claims;
  const hangoutId = req.params;

  console.log("req.params es ", req.params, "req.body es ", ratingData);
  console.log(req.claims);

  try {
    await validate(ratingData);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }
  const { id_rated, rating } = ratingData;

  const ratingObject = {
    id_rater: userId,
    event_id: hangoutId,
    id_rated,
    rating
  };

  const connection = await mysqlPool.getConnection();
  try {
    const sqlInsertRatingQuery = `INSERT INTO Ratings SET ?`;
    await connection.query(sqlInsertRatingQuery, ratingObject);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }

  res.status(200).send();
}

module.exports = createRating;
