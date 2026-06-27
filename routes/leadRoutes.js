const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");

router.get("/leads", leadController.getLeads);
router.post("/create-lead", leadController.createLead);
router.patch("/update-lead/:id", leadController.updateLead);
router.delete("/delete-lead/:id", leadController.deleteLead);

module.exports = router;