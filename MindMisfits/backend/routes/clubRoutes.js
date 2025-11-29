const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Club = require("../models/Club");

// REGISTER CLUB
router.post("/register", async (req, res) => {
    console.log("REGISTER BODY:", req.body);

    try {
        const {
            clubName,
            clubEmail,
            collegeId,
            category,
            description,
            adminName,
            adminEmail,
            password
        } = req.body;

        // Validate required fields
        if (!clubName || !clubEmail || !password || !adminName || !adminEmail) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Generate unique Club ID
        const clubId = "CLUB-" + Math.floor(100000 + Math.random() * 900000);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create club object with correct field names
        const newClub = new Club({
            name: clubName,
            email: clubEmail,
            collegeId,
            category,
            description,
            adminName,
            adminEmail,
            password: hashedPassword,
            clubId
        });

        await newClub.save();

        return res.json({
            success: true,
            message: "Club registered successfully",
            clubId
        });
    } catch (err) {
        console.error("CLUB REGISTER ERROR:", err);
        return res.status(500).json({ error: "Server Error" });
    }
});

// LOGIN CLUB
router.post("/login", async (req, res) => {
    try {
        const { clubId, password } = req.body;

        const club = await Club.findOne({ clubId });
        if (!club) {
            return res.status(404).json({ error: "Club not found" });
        }

        const isMatch = await bcrypt.compare(password, club.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        res.json({
            success: true,
            message: "Login successful",
            clubId: club.clubId,
            clubName: club.name
        });

    } catch (err) {
        console.error("CLUB LOGIN ERROR:", err);
        return res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
