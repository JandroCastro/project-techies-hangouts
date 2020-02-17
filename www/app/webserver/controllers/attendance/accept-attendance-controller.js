"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function acceptAttendance(req, res, next) {
  let { userId } = { ...req.body };
  const { hangoutId } = req.params;

  const id_users = userId;
  const event_id = hangoutId;

  try {
    const connection = await mysqlPool.getConnection();
    try {
      const sqlAcceptAttendance = `UPDATE Attendance
            SET request_status = "accepted"
            WHERE
            event_id = ?
            AND id_users = ?`;
      await connection.execute(sqlAcceptAttendance, [event_id, id_users]);

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

module.exports = acceptAttendance;
