"use strict";

const Joi = require("@hapi/joi");
const mysqlPool = require("../../../database/mysql-pool");
const sengridMail = require("@sengrid/mail");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcrypt");

sengridMail.setApiKey(proccess.env.SENGRID_API_KEY);

async function validate(payload) {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/)
  });

  Joi.assert(payload, schema);
}

async function SendWelcomeEmail(email) {
  const [username] = email.split("@");
  const message = {
    to: email,
    from: "techieshangouts@yopmail.com",
    subject: "Welcome to TechiesHangouts! :D",
    text: `Bienvenido a TechiesHangouts, ${username}! Todo nuestro equipo quiere darte la bienvenida, esperemos que disfrutes de grandes experiencias y oportunidades! Nosotros estamos encantados de aportar nuestro granito de arena para que eso suceda `,
    html: `Bienvenido a TechiesHangouts, ${username}! Todo nuestro equipo quiere darte la bienvenida, esperemos que disfrutes de grandes experiencias y oportunidades! Nosotros estamos encantados de aportar nuestro granito de arena para que eso suceda `
  };

  const data = await sengridMail.send(message);
  return data;
}

async function createUser(req, res, next) {
  const accountData = { ...req.body };

  try {
    await validate(accountData);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }

  const now = new Date()
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");
  const userId = uuidv4();
  const salt = 10;
  const bcryptedPassword = await bcrypt.hash(accountData.password, salt);

  let connection;
  try {
    connection = await mysqlPool.getConnection();
    await connection.query(" INSERT INTO Users SET ?", {
      id: userId,
      email: accountData.email,
      password: bcryptedPassword,
      created_at: now
    });
    connection.release();
    res.status(201).send();

    try {
      await SendWelcomeEmail(accountData.email);
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    if (connection) {
      connection.release();
    }
    console.error(e);
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).send();
    }
  }
}

module.exports = createUser;
