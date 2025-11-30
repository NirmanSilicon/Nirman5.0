const Club = require("../models/club");
const College = require("../models/college");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate clubId like: CLB-123456
const generateClubId = () => {
  return "CLB-" + Math.floor(100000 + Math.random() * 900000);
};

// ---------------- REGISTER CLUB ----------------
exports.registerClub = async (req, res) => {
  try {
    const {
      name,
      collegeId,
      email,
      categoryId,
      adminName,
      adminEmail,
      adminPassword,
      description,
    } = req.body;

    const college = await College.findOne({ collegeId });
    if (!college) {
      return res.status(400).json({ success: false, error: "Invalid college ID" });
    }

    const exists = await Club.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        error: "Club email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const clubId = generateClubId();

    const newClub = new Club({
      clubId,
      name,
      collegeId,
      email,
      categoryId,
      adminName,
      adminEmail,
      passwordHash,
      description,
      approved: true
    });

    await newClub.save();

    return res.json({
      success: true,
      message: "Club registered successfully",
      clubId,
    });

  } catch (err) {
    console.error("REGISTER CLUB ERROR:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ---------------- LOGIN CLUB ----------------
exports.loginClub = async (req, res) => {
  try {
    const { clubId, password } = req.body;

    const club = await Club.findOne({ clubId });
    if (!club) {
      return res.status(400).json({ success: false, error: "Invalid Club ID" });
    }

    const valid = await bcrypt.compare(password, club.passwordHash);
    if (!valid) {
      return res.status(400).json({ success: false, error: "Incorrect password" });
    }

    const token = jwt.sign(
      { clubId: club.clubId, collegeId: club.collegeId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      data: {
        token,
        club: {
          clubId: club.clubId,
          name: club.name,
          description: club.description
        },
      },
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
