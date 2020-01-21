"use strict";

const mySqlPool = require("../../../database/mysql-pool");

const filteringPayload (payload) => {
  let sqlQuery = `SELECT * FROM EVENTS WHERE`

  if(payload.city !== "TODAS"){
    sqlQuery += "city_id = ?"
  } 
  else if(payload.thematics !== "TODAS"){
    sqlQuery += "AND thematic_id = ?"
  }
  else if (payload.dates !== undefined) {
   
    sqlQuery += "AND event_date >= ? AND event_date <= ?" 
  }
  return sqlQuery
}

async function getHangoutsByQuery(req, res, next) {
  const filters = req.query;
  console.log(filters);

  const filtersQuery = filteringPayload(filters)

  const { city, thematics, dates } = filters;

  const initialDate = dates.substring(0, 10);
  const finalDate = dates.substring(11, 21);

 const connection = mySqlPool.getConnection();
  try {
     await connection.query(filtersQuery, {city, thematics, initialDate, finalDate});
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }

  res.send("Conectado");
}

module.exports = getHangoutsByQuery;
