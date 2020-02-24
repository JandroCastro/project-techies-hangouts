"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getRating(req, res, next) {
  const id_rated = req.params;

  const connection = await mysqlPool.getConnection();
  try {
    const sqlQuery = `SELECT * FROM Ratings WHERE id_rated = ?`;
    const [rows] = await connection.query(sqlQuery, { id_rated });
    connection.release();

    if (rows.length === 0) {
      return res.status(404).send();
    }
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }

  res.send(rows);
}

module.exports = getRating;
