const jwt = require("jsonwebtoken");
const College = require("../models/college");

exports.verifyCollegeToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    const college = await College.findOne({ collegeId: decoded.collegeId }).lean();
    if (!college) {
      return res.status(401).json({ success: false, error: "Invalid token data" });
    }

    req.college = college;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
