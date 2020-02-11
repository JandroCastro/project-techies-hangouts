"use strict";

const mySqlPool = require("../../../database/mysql-pool");

async function getAllAttendance(req, res, next) {
  const { userId } = req.params;

  let connection;

  try {
    connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT * FROM Attendance a INNER JOIN Events e ON a.event_id = e.id WHERE NOT request_status = 'rejected' AND id_users = ?`;
    const [rows] = await connection.query(sqlQuery, userId);
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
module.exports = getAllAttendance;
