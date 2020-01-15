"use strict";

const Joi = require("@hapi/joi");
const mysqlPool = require("../../../database/mysql-pool");
const sengridMail = require("@sendgrid/mail");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcrypt");

const httpServerDomain = process.env.HTTP_SERVER_DOMAIN;
const defaultImageUrl =
  "https://www.freepik.es/vector-premium/avatar-hombre-negocios_2781932.htm";

sengridMail.setApiKey(process.env.SENGRID_API_KEY);

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
  const userData = { ...req.body };

  try {
    await validate(userData);
    /**
     * At this point, note was created, so,
     * we can associate the tags
     *  - insertar relacíon entre tag y note en la tabla notes_tags
     *  - note_id, tag_id, created_at
     */
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
  const bcryptedPassword = await bcrypt.hash(userData.password, salt);

  let connection;
  try {
    const connection = await mysqlPool.getConnection();

    try {
      const sqlCreateUser = `INSERT INTO Users SET ?`;
      await connection.query(sqlCreateUser, {
        id: userId,
        email: userData.email,
        password: bcryptedPassword,
        created_at: now
      });

      try {
        const sqlCreateProfile = `INSERT INTO Profiles SET ?`;
        await connection.query(sqlCreateProfile, {
          user_id: userId,
          avatar_url: defaultImageUrl,
          created_at: now
        });
      } catch (e) {
        console.error(e);
        throw e;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }

    connection.release();

    res.header("Location", `${httpServerDomain}/api/users/${userId}`);
    res.status(201).send(userId);
    /**
     * Pongo que me devuelva userId para poder guardar en la
     * variable de entorno de Postman y poder seguir probando
     */

    /*
    try {
      await SendWelcomeEmail(userData.email);
    } catch (e) {
      console.error(e);
    }*/

    /**
     * Silencio SendGrid porque no me va la API, por tema de
     * API KEYS
     */
  } catch (e) {
    if (connection) {
      connection.release();
    }
    console.error(e);
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).send();
    }
    return res.status(500).send();
  }
}

module.exports = createUser;
