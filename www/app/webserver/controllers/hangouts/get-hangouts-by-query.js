"use strict";

const mySqlPool = require("../../../database/mysql-pool");

function filteringPayload(payload) {
  let sqlQuery = `SELECT * FROM Events WHERE`;
  /**
   * En la query, si no entra con city, se encuentra con un AND que la va
   * a romper. Por tanto, pienso que a cada paso se debería hacer un split,
   * y si la última posición de sqlQuery es = WHERE, entonces no se añadiría
   * AND, en caso de que sea distinto, quiere decir que entró en city, modificó
   * la query y si hay que añadir AND. Vale el caso tanto para thematic
   * como para dates
   */
  if (payload.city !== "TODAS") {
    sqlQuery += "city_id = ?";
  } else if (payload.thematics !== "TODAS") {
    sqlQuery += "AND thematic_id = ?";
  } else if (payload.dates !== undefined) {
    sqlQuery += "AND event_date >= ? AND event_date <= ?";
  }
  return sqlQuery;
}

async function getHangoutsByQuery(req, res, next) {
  const filters = req.query;
  console.log(filters);

  const filtersQuery = filteringPayload(filters);

  const { city, thematics, dates } = filters;

  const initialDate = dates.substring(0, 10);
  const finalDate = dates.substring(11, 21);

  const connection = mySqlPool.getConnection();
  try {
    await connection.query(filtersQuery, {
      city,
      thematics,
      initialDate,
      finalDate
    });
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }

  res.send("Conectado");
}

module.exports = getHangoutsByQuery;
