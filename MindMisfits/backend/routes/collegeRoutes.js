const express = require("express");
const router = express.Router();
const { registerCollege } = require("../controllers/collegeController");

router.post("/register", registerCollege);

module.exports = router;
