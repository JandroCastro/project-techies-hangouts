"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function createAttendance(req, res, next) {
  const { userId } = req.claims;
  const { hangoutId } = req.params;

  const attendanceObject = {
    id_users: userId,
    event_id: hangoutId,
    request_status: "pending"
  };
  console.log(req.params);
  try {
    const connection = await mysqlPool.getConnection();
    try {
      const sqlCreateAttendance = `INSERT INTO Attendance SET ?`;
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
