const Club = require("../models/Club");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateClubId = () => {
  return "CLB-" + Math.floor(100000 + Math.random() * 900000);
};

exports.registerClub = async (req, res) => {
  try {
    const { name, category, password } = req.body;

    const clubId = generateClubId();
    const passwordHash = await bcrypt.hash(password, 10);

    const club = await Club.create({
      clubId,
      name,
      category,
      passwordHash
    });

    res.json({ message: "Club Registered", clubId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginClub = async (req, res) => {
  const { clubId, password } = req.body;

  const club = await Club.findOne({ clubId });
  if (!club) return res.status(400).json({ error: "Invalid ID" });

  const isMatch = await bcrypt.compare(password, club.passwordHash);
  if (!isMatch) return res.status(400).json({ error: "Invalid Password" });

  const token = jwt.sign({ id: club.clubId, role: "club" }, process.env.JWT_SECRET);

  res.json({ token });
};

// Updates
exports.updateAbout = async (req, res) => {
  await Club.updateOne({ clubId: req.params.clubId }, { about: req.body.about });
  res.json({ message: "About Updated" });
};

exports.updateContact = async (req, res) => {
  await Club.updateOne({ clubId: req.params.clubId }, { contact: req.body.contact });
  res.json({ message: "Contact Updated" });
};

exports.updateRegistrationInfo = async (req, res) => {
  await Club.updateOne({ clubId: req.params.clubId }, { registrationInfo: req.body.registrationInfo });
  res.json({ message: "Registration Info Updated" });
};

exports.addAnnouncement = async (req, res) => {
  await Club.updateOne(
    { clubId: req.params.clubId },
    { $push: { announcements: req.body } }
  );

  res.json({ message: "Announcement Added" });
};

exports.getClub = async (req, res) => {
  const club = await Club.findOne({ clubId: req.params.clubId });
  res.json(club);
};