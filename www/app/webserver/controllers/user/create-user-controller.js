"use strict";

const Joi = require("@hapi/joi");
const mysqlPool = require("../../../database/mysql-pool");
const sengridMail = require("@sendgrid/mail");
const uuidv4 = require("uuid/v4");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const httpServerDomain = process.env.HTTP_SERVER_DOMAIN;
const defaultImageUrl =
  "https://image.freepik.com/vector-gratis/avatar-hombre-negocios_24908-26533.jpg";

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
  /**
   * Con la creación de usuario le damos un rating automático de 5
   * para que en el frontend no tenga los 404 que dan la lata,
   * escogemos un usuario que haga la puntuación y un evento de los creados
   * manualmente
   */
  const id_rater = "8d58cfa8-c52d-4e7b-b7c5-49ce8a470f50";
  const event_id = "074f546d-860c-49ba-9ed2-185933c7aa3d";

  try {
    await validate(userData);
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

  const userInfo = {
    id: userId,
    email: userData.email,
    password: bcryptedPassword,
    created_at: now
  };

  const ratingInfo = {
    id_rater,
    event_id,
    id_rated: userId,
    rating: 5
  };

  const attendanceInfo = {
    id_users: userId,
    event_id
  };

  let connection;
  try {
    const connection = await mysqlPool.getConnection();

    try {
      const sqlCreateUser = `INSERT INTO Users SET ?`;
      await connection.query(sqlCreateUser, userInfo);

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
      try {
        const sqlCreateAttendanceToRating = `INSERT INTO Attendance SET ?`;
        await connection.query(sqlCreateAttendanceToRating, attendanceInfo);
      } catch (e) {
        console.error(e);
        throw e;
      }
      try {
        const sqlCreateRating = `INSERT INTO Ratings SET ?`;
        await connection.query(sqlCreateRating, ratingInfo);
      } catch (e) {
        console.error(e);
        throw e;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }

    connection.release();

    const payloadJwt = {
      userId
    };

    const jwtExpiresIn = parseInt(process.env.AUTH_ACCESS_TOKEN_TTL);
    const token = jwt.sign(payloadJwt, process.env.AUTH_JWT_SECRET, {
      expiresIn: jwtExpiresIn
    });

    res.header("Location", `${httpServerDomain}/api/users/${userId}`);

    return res.status(201).send({
      token,
      userId,
      email: userData.email
    });

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
