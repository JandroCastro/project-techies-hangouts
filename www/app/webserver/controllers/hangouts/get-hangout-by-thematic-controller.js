"use strict";

const mySqlPool = require("../../../database/mysql-pool");

async function getHangoutByThematic(req, res, next) {
  const { thematicId } = req.params;

  const now = new Date()
    .toISOString()
    .substring(0, 19)
    .replace("T", " ")
    .split(" ");

  const today = now[0];
  const currentHour = now[1];

  let connection;
  try {
    connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT * FROM Thematics
    WHERE thematic_id = ? 
    AND event_date >= ? 
    AND event_hour > ? 
    ORDER BY event_date,event_hour ASC `;
    const [rows] = await connection.execute(sqlQuery, [
      thematicId,
      today,
      currentHour
    ]);
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
module.exports = getHangoutByThematic;
