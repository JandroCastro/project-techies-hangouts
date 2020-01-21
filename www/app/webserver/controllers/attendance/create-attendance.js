"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function createAttendance(req, res, next) {
  let { userId } = req.claims;

  const attendanceObject = {
    id_users: userId,
    event_id: req.params,
    request_status: "pending"
  };

  try {
    const connection = await mysqlPool.getConnection();
    try {
      const sqlCreateAttendance = "INSERT INTO Attendance SET ?";
      await connection.query(sqlCreateAttendance, attendanceObject);

      connection.release();
      return res.status(200).send();
    } catch (e) {
      connection.release();
      throw e;
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = createAttendance;
