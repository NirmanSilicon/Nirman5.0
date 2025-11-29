const express = require("express");
const { registerCollege, loginCollege } = require("../controllers/collegeController");

const router = express.Router();

router.post("/register", registerCollege);
router.post("/login", loginCollege);

module.exports = router;
