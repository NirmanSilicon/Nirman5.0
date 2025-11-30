const express = require("express");
const {
  registerCollege,
  loginCollege,
  approveClub,
  getCollegeStats,
  updateCollegeDetails,
} = require("../controllers/collegeController");

const router = express.Router();

router.post("/register", registerCollege);
router.post("/login", loginCollege);
router.post("/approve", approveClub);
router.get("/stats", getCollegeStats);
router.patch("/details", updateCollegeDetails);

module.exports = router;
