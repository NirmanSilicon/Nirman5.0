const express = require("express");
const College = require("../models/college");
const Club = require("../models/club");

const router = express.Router();

/**
 * GET /api/colleges
 * Supports:
 * - ?id=CLG-XXXXXX
 * - ?search=string
 * - ?city=City
 * - ?state=State
 */
router.get("/", async (req, res) => {
    try {
        const { id, search, city, state } = req.query;

        // ---------------------------------------------------------------------
        // 1️⃣ SEARCH BY COLLEGE ID (FRONTEND COLLEGE PAGE)
        // ---------------------------------------------------------------------
        if (id) {
            const college = await College.findOne({ collegeId: id });

            if (!college) return res.json({ success: true, data: [] });

            // Fetch all clubs under this college
            const clubs = await Club.find({ collegeId: id });

            return res.json({
                success: true,
                data: {
                    id: college._id,
                    college_id: college.collegeId,
                    name: college.name,
                    location: college.location,
                    city: college.city || "",
                    state: college.state || "",
                    official_website: college.officialWebsite || "",
                    official_email: college.officialEmail || "",
                    
                    clubs: clubs.map((c) => ({
                        id: c.clubId,                                  // frontend expects id
                        name: c.name,
                        description: c.description || "",
                        category_name: c.category || "",                // readable name
                        category_slug: (c.category || "")
                            .toLowerCase()
                            .replace(/\s+/g, "-"),                      // slug like: "tech-club"
                    })),
                },
            });
        }

        // ---------------------------------------------------------------------
        // 2️⃣ SEARCH MULTIPLE COLLEGES (listing page)
        // ---------------------------------------------------------------------
        let query = {};

        if (search) query.name = new RegExp(search, "i");
        if (city) query.city = new RegExp(city, "i");
        if (state) query.state = new RegExp(state, "i");

        const colleges = await College.find(query);

        const result = await Promise.all(
            colleges.map(async (college) => {
                const clubs = await Club.find({ collegeId: college.collegeId });

                return {
                    id: college._id,
                    college_id: college.collegeId,
                    name: college.name,
                    location: college.location,
                    city: college.city || "",
                    state: college.state || "",
                    official_website: college.officialWebsite || "",
                    official_email: college.officialEmail || "",
                    
                    clubs: clubs.map((c) => ({
                        id: c.clubId,
                        name: c.name,
                        description: c.description || "",
                        category_name: c.category || "",
                        category_slug: (c.category || "")
                            .toLowerCase()
                            .replace(/\s+/g, "-"),
                    })),
                };
            })
        );

        return res.json({ success: true, data: result });

    } catch (error) {
        console.error("COLLEGE SEARCH ERROR:", error);
        return res.status(500).json({ success: false, error: "Server error" });
    }
});

module.exports = router;
