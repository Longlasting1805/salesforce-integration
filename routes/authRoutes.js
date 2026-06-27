const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");

// IMPORTANT: POST route
router.post("/app-login", login);

module.exports = router;