'use strict';

const Joi = require('@hapi/joi');
const mySqlPool = require('mysql2');
const httpServerDomain = process.env.HTTP_SERVER_DOMAIN;


async function validate(payload) {
    const schema = Joi.object({
        name: Joi.string()
            .trim()
            .min(1)
            .max(100)
            .required(),
        category: Joi.string()
            .trim()
            .min(5)
            .max(100)
            .required(),
        position: Joi.string()
            .trim()
            .min(5)
            .max(100)
            .required(),
        about: Joi.string()
            .trim()
            .min(5)
            .max(100)
            .required(),
        age: Joi.number()
            .min(1)
            .max(4)
            .required(),
        link: Joi.link()
    });

    Joi.assert(payload, schema);
}

async function createProfile {
const profileData = {...req.body},
const {userId} = req.claims;

try {
        await validate(profileData);
    } catch (e) {
        return res.status(400).send(e);
    }

    const now = new Date()
        .toISOString()
        .substring(0, 19)
        .replace("T", " ");

    const{
        age, name, category, position, about, link
    } = profileData;

    const profile = {
        user_id: userId,
        age,
        name,
        category,
        position,
        aboutMe: about,
        link_url: link,
        created_at: now
    }

    try {
        const connection = await mySqlPool.getConnection();
        
        const sqlQuery = "INSERT INTO Profiles SET ?";
        await connection.query(sqlQuery, profile);
        connection.release();
        res.header("Location", `${httpServerDomain}/api/profiles/${userId}`)
        return res.status(201).send()

        
    } catch (e) {
        if(connection) {
            connection.release();
        }
        return res.status(500).send();
        
    }



}

module.exports = createProfile;