"use strict";

const mySqlPool = require("../../../database/mysql-pool");

async function getUser(req, res, next) {
  const userEmail = { ...req.body };

  let connection;
  try {
    connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT email,password FROM Users WHERE email = ? AND deleted_at IS null`;
    const [rows] = await connection.query(sqlQuery, userEmail.email);
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
module.exports = getUser;
