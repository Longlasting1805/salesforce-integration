const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");

router.get("/leads", leadController.getLeads);

module.exports = router;