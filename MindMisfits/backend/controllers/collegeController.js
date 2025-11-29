const College = require("../models/College");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate unique college code
const generateCollegeId = () => {
  return "CLG-" + Math.floor(100000 + Math.random() * 900000);
};

exports.registerCollege = async (req, res) => {
  try {
    const { name, address, password } = req.body;

    const collegeId = generateCollegeId();
    const passwordHash = await bcrypt.hash(password, 10);

    const college = await College.create({
      collegeId,
      name,
      address,
      passwordHash,
      clubs: []
    });

    res.json({ message: "College Registered", collegeId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginCollege = async (req, res) => {
  const { collegeId, password } = req.body;

  const college = await College.findOne({ collegeId });
  if (!college) return res.status(400).json({ error: "Invalid ID" });

  const isMatch = await bcrypt.compare(password, college.passwordHash);
  if (!isMatch) return res.status(400).json({ error: "Invalid Password" });

  const token = jwt.sign({ id: college.collegeId, role: "college" }, process.env.JWT_SECRET);

  res.json({ token });
};

exports.getCollege = async (req, res) => {
  const college = await College.findOne({ collegeId: req.params.collegeId });
  res.json(college);
};

exports.getAllColleges = async (req, res) => {
  const colleges = await College.find();
  res.json(colleges);
};