"use strict";

const cloudinary = require("cloudinary").v2;
const mysqlPool = require("../../../database/mysql-pool");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadAvatar(req, res, next) {
  const { userId } = req.claims;
  const { file } = req;
  console.log({ file });
  if (!file || !file.buffer) {
    return res.status(400).send({
      message: "invalid image"
    });
  }

  /**
   * En este punto, hay archivo (imagen), entonces
   * necesitamos "streaming" la imagen del usuario (de la request) hacia cloudinary
   */
  cloudinary.uploader
    .upload_stream(
      {
        resource_type: "image",
        public_id: userId,
        width: 200,
        height: 200,
        format: "jpeg",
        crop: "limit"
      },
      async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(400).send(err);
        }

        const { secure_url: secureUrl } = result;
        console.log(result);

        let connection;
        try {
          const sqlQuery = `UPDATE Profiles
      SET avatar_url = ?
      WHERE user_id = ?`;
          connection = await mysqlPool.getConnection();
          connection.execute(sqlQuery, [secureUrl, userId]);
          connection.release();

          res.header("Location", secureUrl);
          return res.status(201).send();
        } catch (e) {
          if (connection) {
            connection.release();
          }
          console.error(e);
          return res.status(500).send(e.message);
        }
      }
    )
    .end(file.buffer);
}

module.exports = uploadAvatar;
