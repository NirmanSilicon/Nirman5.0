const express = require("express");
const Project = require("../models/Project");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/projects  (protected - needs login)
router.post("/", auth, async (req, res) => {
  try {
    const { name, location, area, tonnes, owner } = req.body;

    if (!name || !location || !area || !tonnes || !owner) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const project = await Project.create({
      name,
      location,
      area,
      tonnes,
      owner,
    });

    res.json(project);
  } catch (err) {
    console.error("Create project error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/projects (public - anyone can view)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("Get projects error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
