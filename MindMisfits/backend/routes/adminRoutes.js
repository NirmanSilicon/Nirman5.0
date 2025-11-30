const express = require("express");
const router = express.Router();
const { verifyCollegeToken } = require("../middleware/auth");

// GET stats example
router.get("/college/stats", verifyCollegeToken, async (req, res) => {
  try {
    // Example static / placeholder data — replace with real queries
    const stats = {
      approved_clubs: 12,
      pending_clubs: 3,
      total_views: 452,
    };

    // Example pending clubs list — replace with DB fetch
    const pendingClubs = [
      { id: 1, name: "Tech Club", email: "tech@c.edu", admin_name: "Alice", created_at: new Date() },
    ];

    return res.json({ success: true, data: { stats, pendingClubs } });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, error: "Server error" });
  }
});

module.exports = router;
