"use strict";

const mySqlPool = require("../../../database/mysql-pool");

/**
 *
 * Sería muy interesante que hubiese solo una columna en la tabla con DATETIME para
 * poder mostrar los eventos que no han ocurrido ya (por fecha y hora). De esta forma
 * puede pasar que te muestre eventos ya ocurridos ese día o que no
 * te muestre los eventos del día en que realizas la búsqueda, no lo sé.
 *
 */

async function getAllHangouts(req, res, next) {
  let connection;
  try {
    connection = await mySqlPool.getConnection();
    const sqlQuery = `SELECT * FROM Events WHERE
    event_date  >= ?
    AND deleted_at IS NULL
    ORDER BY event_date ASC`;

    const today = new Date().toISOString().substring(0, 10);

    const [rows] = await connection.execute(sqlQuery, [today]);
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

module.exports = getAllHangouts;
