"use strict";

const express = require("express");
const createUser = require("../controllers/user/create-user-controller");
const deleteUser = require("../controllers/user/delete-user-controller");

const router = express.Router();

router.post("/users", createUser);
router.delete("/users/:userId", deleteUser);

module.exports = router;
