// controllers/collegeController.js

const College = require("../models/college");
const Club = require("../models/club");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate collegeId like: CLG-123456
const generateCollegeId = () =>
  "CLG-" + Math.floor(100000 + Math.random() * 900000);

// ---------------- REGISTER COLLEGE ----------------
const registerCollege = async (req, res) => {
  try {
    const { name, email, adminPassword } = req.body;

    // Check duplicate college email
    const exists = await College.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ success: false, error: "College already registered" });

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const collegeId = generateCollegeId();

    const newCollege = new College({
      collegeId,
      name,
      email,
      passwordHash,
      createdAt: new Date(),
    });

    await newCollege.save();

    return res.json({
      success: true,
      message: "College registered successfully",
      collegeId,
    });
  } catch (err) {
    console.error("REGISTER COLLEGE ERROR:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ---------------- LOGIN COLLEGE ----------------
const loginCollege = async (req, res) => {
  try {
    const { collegeId, adminPassword } = req.body;

    const college = await College.findOne({ collegeId });

    if (!college)
      return res
        .status(400)
        .json({ success: false, error: "Invalid College ID" });

    const valid = await bcrypt.compare(adminPassword, college.passwordHash);
    if (!valid)
      return res
        .status(400)
        .json({ success: false, error: "Incorrect password" });

    const token = jwt.sign(
      { collegeId: college.collegeId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      data: {
        token,
        admin: {
          collegeId: college.collegeId,
          collegeName: college.name,
        },
      },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ---------------- APPROVE OR REJECT CLUB ----------------
const approveClub = async (req, res) => {
  try {
    const { clubId, action } = req.body;

    const club = await Club.findOne({ clubId });
    if (!club)
      return res.status(400).json({ success: false, error: "Invalid club ID" });

    club.approved = action === "approve";
    await club.save();

    return res.json({
      success: true,
      message:
        action === "approve"
          ? "Club approved successfully"
          : "Club rejected successfully",
    });
  } catch (err) {
    console.error("APPROVE CLUB ERROR:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ---------------- COLLEGE DASHBOARD STATS ----------------
const getCollegeStats = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    const approvedClubs = await Club.countDocuments({
      collegeId,
      approved: true,
    });

    const pendingClubs = await Club.countDocuments({
      collegeId,
      approved: false,
    });

    return res.json({
      success: true,
      data: {
        stats: {
          approved_clubs: approvedClubs,
          pending_clubs: pendingClubs,
          total_views: 0, // placeholder
        },
        pendingClubs: await Club.find({
          collegeId,
          approved: false,
        }).select("clubId name email adminName createdAt"),
      },
    });
  } catch (err) {
    console.error("COLLEGE STATS ERROR:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ---------------- UPDATE COLLEGE DETAILS ----------------
const updateCollegeDetails = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    await College.updateOne({ collegeId }, req.body);

    return res.json({
      success: true,
      message: "College details updated",
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = {
  registerCollege,
  loginCollege,
  approveClub,
  getCollegeStats,
  updateCollegeDetails,
};
