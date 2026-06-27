const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");

router.get("/leads", leadController.getLeads);
router.post("/create-lead", leadController.createLead);

module.exports = router;