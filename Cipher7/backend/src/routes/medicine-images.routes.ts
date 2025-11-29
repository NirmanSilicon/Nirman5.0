/**
 * Medicine Images Routes
 * Fetches medicine images from external sources
 */

import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * GET /api/medicine-images/:medicineName
 * Get medicine image URL from external sources
 */
router.get("/:medicineName", async (req, res) => {
  try {
    const { medicineName } = req.params;
    const { genericName } = req.query;

    if (!medicineName) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Medicine name is required",
      });
    }

    // Clean the medicine name
    const cleanName = (genericName || medicineName)
      .toString()
      .replace(/Tablets?|Capsules?|Syrup|Suspension|Injection|IP|mg|ml|g|per\s*\d+|and|with|hydrochloride|sodium|maleate/gi, '')
      .trim()
      .split(/\s+/)[0]
      .substring(0, 20);

    // Generate seed for consistent images
    const seed = cleanName.split('').reduce((acc: number, char: string) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    // Use Unsplash API for medicine images
    // Unsplash has medicine/pharmaceutical related images
    const imageUrl = `https://source.unsplash.com/300x200/?medicine,pharmaceutical,pill,tablet,capsule,drug,pharmacy,medication&sig=${Math.abs(seed)}`;

    res.json({
      success: true,
      imageUrl: imageUrl,
      medicineName: cleanName,
    });
  } catch (error: any) {
    console.error("Error fetching medicine image:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch medicine image",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;

