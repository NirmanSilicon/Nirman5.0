const express = require("express");
const router = express.Router();
const College = require("../models/College");
const Club = require("../models/Club");

// Get all colleges
router.get("/colleges", async (req, res) => {
  res.json(await College.find());
});

// Get college by ID
router.get("/colleges/:id", async (req, res) => {
  res.json(await College.findOne({ collegeId: req.params.id }));
});

// Get club by ID
router.get("/clubs/:id", async (req, res) => {
  res.json(await Club.findOne({ clubId: req.params.id }));
});

// Get clubs by category
router.get("/category/:category", async (req, res) => {
  res.json(await Club.find({ category: req.params.category }));
});

module.exports = router;
