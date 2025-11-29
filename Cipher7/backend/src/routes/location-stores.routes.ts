/**
 * Location Stores Routes
 * Serves location store data from JSON files
 */

import express from "express";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router: express.Router = express.Router();

// State name to filename mapping
const stateFileMap: Record<string, string> = {
  "Andaman And Nicobar Islands": "AndamanAndNicobarIslands",
  "Delhi": "Delhi",
  "Maharashtra": "Maharashtra",
  "Karnataka": "Karnataka",
  "West Bengal": "WestBengal",
  "Uttarakhand": "Uttarakhand",
  "Tripura": "Tripura",
  "Telangana": "Telangana",
  "Rajasthan": "Rajasthan",
  "Sikkim": "Sikkim",
  "Punjab": "Punjab",
  "Odisha": "Odisha",
  "Puducherry": "Puducherry",
  "Nagaland": "Nagaland",
  "Mizoram": "Mizoram",
  "Meghalaya": "Meghalaya",
  "Manipur": "Manipur",
  "Madhya Pradesh": "MadhyaPradesh",
  "Lakshadweep": "Lakshadweep",
  "Ladakh": "Ladakh",
  "Kerala": "Kerala",
  "Jharkhand": "Jharkhand",
  "Jammu And Kashmir": "JammuAndKashmir",
  "Himachal Pradesh": "HimachalPradesh",
  "Haryana": "Haryana",
  "Dadra And Nagar Haveli And Daman And Diu": "DadraAndNagarHaveliAndDamanAndDiu",
  "Arunachal Pradesh": "ArunachalPradesh",
  "Assam": "Assam",
  "Bihar": "Bihar",
  "Chandigarh": "Chandigarh",
  "Chhattisgarh": "Chhattisgarh",
  "Goa": "Goa",
  "Gujarat": "Gujarat",
  "Tamil Nadu": "TamilNadu",
  "Uttar Pradesh": "UttarPradesh",
};

/**
 * Get the correct file path for location JSON files
 */
function getLocationFilePath(fileName: string): string {
  // Try multiple possible paths
  // Backend runs from packages/backend, so we need to go up 2 levels to project root
  const possiblePaths = [
    join(process.cwd(), "../../locaton json", `${fileName}.js`), // From packages/backend to project root
    join(__dirname, "../../../../locaton json", `${fileName}.js`), // From backend/src/routes to project root
    join(process.cwd(), "../locaton json", `${fileName}.js`), // From backend folder (if running from backend)
    join(process.cwd(), "locaton json", `${fileName}.js`), // From project root (if running from root)
  ];

  for (const filePath of possiblePaths) {
    if (existsSync(filePath)) {
      console.log(`[Location Stores] Found file at: ${filePath}`);
      return filePath;
    }
  }

  // Log all attempted paths for debugging
  console.log(`[Location Stores] File not found. Attempted paths:`, possiblePaths);
  console.log(`[Location Stores] Current working directory: ${process.cwd()}`);
  
  // Return the first path as default (will throw error if not found)
  return possiblePaths[0];
}

/**
 * GET /api/location-stores/search
 * Search for store by state and district
 * NOTE: This must be defined BEFORE /:state route to avoid route conflicts
 */
router.get("/search", async (req, res) => {
  try {
    const { state, district } = req.query;

    if (!state) {
      return res.status(400).json({
        error: "Bad Request",
        message: "State parameter is required",
      });
    }

    const fileName = stateFileMap[state as string] || (state as string).replace(/\s+/g, "");
    const filePath = getLocationFilePath(fileName);

    console.log(`[Location Stores] Searching for state: ${state}, district: ${district}`);
    console.log(`[Location Stores] Using file: ${filePath}`);

    try {
      if (!existsSync(filePath)) {
        return res.status(404).json({
          error: "Not Found",
          message: `No store data file found for state: ${state}. File path: ${filePath}`,
        });
      }

      const fileContent = readFileSync(filePath, "utf-8");
      // Extract the store data from the JS file
      const match = fileContent.match(/const\s+\w+Stores\s*=\s*({[\s\S]*?});/);
      
      if (!match) {
        return res.status(404).json({
          error: "Not Found",
          message: `Could not parse store data for ${state}`,
        });
      }

      // Safely evaluate the JSON-like object
      let storeData;
      try {
        storeData = eval(`(${match[1]})`);
        console.log(`[Location Stores] Loaded data for state: ${storeData.state}, districts: ${storeData.districts?.length || 0}`);
      } catch (evalError: any) {
        console.error('[Location Stores] Error evaluating store data:', evalError);
        return res.status(500).json({
          error: "Internal Server Error",
          message: `Failed to parse store data for ${state}`,
          details: process.env.NODE_ENV === "development" ? evalError.message : undefined,
        });
      }

      if (!storeData.districts || !Array.isArray(storeData.districts)) {
        return res.status(404).json({
          error: "Not Found",
          message: `Invalid store data structure for ${state}`,
        });
      }

      // Normalize district name for matching (case-insensitive)
      const normalizeDistrict = (dist: string) => {
        return dist.trim().toLowerCase().replace(/\s+/g, " ");
      };

      const searchDistrict = district ? normalizeDistrict(district as string) : null;
      console.log(`[Location Stores] Searching for district: "${searchDistrict}"`);

      // Find matching district
      let matchingStore = null;
      if (searchDistrict) {
        matchingStore = storeData.districts.find((dist: any) => {
          const distName = normalizeDistrict(dist.district);
          const matches = distName === searchDistrict || 
                 distName.includes(searchDistrict) ||
                 searchDistrict.includes(distName);
          if (matches) {
            console.log(`[Location Stores] Found match: "${dist.district}" matches "${searchDistrict}"`);
          }
          return matches;
        });
      }

      // If no match, return first store
      if (!matchingStore && storeData.districts.length > 0) {
        console.log(`[Location Stores] No exact match found, returning first store: ${storeData.districts[0].district}`);
        matchingStore = storeData.districts[0];
      }

      if (matchingStore && matchingStore.store) {
        console.log(`[Location Stores] Returning store: ${matchingStore.store.name}, district: ${matchingStore.district}`);
        res.json({
          success: true,
          store: {
            ...matchingStore.store,
            state: storeData.state,
            district: matchingStore.district,
          },
        });
      } else {
        res.status(404).json({
          error: "Not Found",
          message: `No store found for ${state}${district ? `, ${district}` : ""}`,
        });
      }
    } catch (fileError: any) {
      console.error('[Location Stores] File error:', fileError);
      if (fileError.code === "ENOENT") {
        res.status(404).json({
          error: "Not Found",
          message: `No store data found for state: ${state}. File path: ${filePath}`,
        });
      } else {
        throw fileError;
      }
    }
  } catch (error: any) {
    console.error("[Location Stores] Error searching location stores:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to search location stores",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * GET /api/location-stores/:state
 * Get stores for a specific state
 */
router.get("/:state", async (req, res) => {
  try {
    const { state } = req.params;
    const fileName = stateFileMap[state] || state.replace(/\s+/g, "");
    const filePath = getLocationFilePath(fileName);

    try {
      if (!existsSync(filePath)) {
        return res.status(404).json({
          error: "Not Found",
          message: `No store data found for state: ${state}`,
        });
      }

      const fileContent = readFileSync(filePath, "utf-8");
      // Extract the store data from the JS file
      const match = fileContent.match(/const\s+\w+Stores\s*=\s*({[\s\S]*?});/);
      
      if (!match) {
        return res.status(404).json({
          error: "Not Found",
          message: `Could not parse store data for ${state}`,
        });
      }

      // Safely evaluate the JSON-like object
      let storeData;
      try {
        storeData = eval(`(${match[1]})`);
      } catch (evalError: any) {
        console.error('Error evaluating store data:', evalError);
        return res.status(500).json({
          error: "Internal Server Error",
          message: `Failed to parse store data for ${state}`,
          details: process.env.NODE_ENV === "development" ? evalError.message : undefined,
        });
      }
      
      res.json({
        success: true,
        data: storeData,
      });
    } catch (fileError: any) {
      if (fileError.code === "ENOENT") {
        res.status(404).json({
          error: "Not Found",
          message: `No store data found for state: ${state}`,
        });
      } else {
        throw fileError;
      }
    }
  } catch (error: any) {
    console.error("Error loading location stores:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to load location stores",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;
