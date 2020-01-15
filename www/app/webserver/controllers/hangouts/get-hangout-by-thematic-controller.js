"use strict";

const mySqlPool = require("../../../database/mysql-pool");

async function getHangoutByThematic(req, res, next) {
  const { thematicName } = req.params;
  console.log(req.params);

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

    const consultThematicIdQuery = `SELECT *
      FROM Thematics
      WHERE
        name = ?`;
    const [row] = await connection.query(consultThematicIdQuery, thematicName);
    connection.release();

    if (row.length === 0) {
      return res.status(400).send();
    }
    const thematicId = row[0].id;
    const sqlQuery = `SELECT * FROM Events
    WHERE thematic_id = ? 
    AND event_date >= ? 
    ORDER BY event_date,event_hour ASC `;
    const [rows] = await connection.execute(sqlQuery, [
      thematicId,
      today,
      currentHour
    ]);
    console.log(rows);
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
