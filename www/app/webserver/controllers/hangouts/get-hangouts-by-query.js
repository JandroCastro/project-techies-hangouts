"use strict";

const mySqlPool = require("../../../database/mysql-pool");

function payloadToQuery(payload) {
  const query = "SELECT * FROM Events WHERE deleted_at IS null and";

  const arrObject = [];

  for (const property in payload) {
    let data = {
      column: property,
      value: payload[property],
      operator: " "
    };

    if (data.column === "event_date1") {
      data.operator = ">=";
      data.column = "event_date";
    } else if (data.column === "event_date2") {
      data.operator = "<=";
      data.column = "event_date";
    } else {
      data.operator = "=";
    }

    arrObject.push(data);
  }

  const parsedParams = arrObject
    .filter(param => !!param.value)
    .map(({ column, value, operator }) => `${column} ${operator} "${value}"`)
    .join(" AND ");

  const solution = `${query} ${parsedParams}`;

  return solution;
}

async function getHangoutsByQuery(req, res, next) {
  const filters = req.query;
  console.log(filters);

  const sqlQuery = payloadToQuery(filters);
  console.log(sqlQuery);

  try {
    const connection = await mySqlPool.getConnection();

    const [rows] = await connection.query(sqlQuery);

    if (rows.length === 0) res.status(404).send();

    res.send(rows);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
}

module.exports = getHangoutsByQuery;
