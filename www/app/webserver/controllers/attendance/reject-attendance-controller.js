"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function rejectAttendance(req, res, next) {
  let { userId } = req.claims;
  const { hangoutId } = req.params;

  const id_users = userId;
  const event_id = hangoutId;

  try {
    const connection = await mysqlPool.getConnection();
    try {
      const sqlRejectAttendance = `UPDATE Attendance
            SET request_status = "rejected"
            WHERE
            event_id = ?
            AND id_users = ?`;
      await connection.execute(sqlRejectAttendance, [event_id, id_users]);

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

module.exports = rejectAttendance;
