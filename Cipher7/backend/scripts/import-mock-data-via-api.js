/**
 * Import Mock Data via API
 * Uses the data import endpoints to load mock data through the API
 * Requires backend server to be running
 */

import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.FRONTEND_URL?.replace(":3000", ":5000") || "http://localhost:5000";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ""; // You'll need to provide a valid admin JWT token

async function importMockData() {
  console.log("🚀 Importing mock data via API...\n");
  console.log(`📡 API URL: ${API_URL}\n`);

  if (!ADMIN_TOKEN) {
    console.log("⚠️  Warning: ADMIN_TOKEN not set. You'll need to login as admin first.");
    console.log("   Get a token by logging in as an admin user.\n");
  }

  try {
    // 1. Import ICMR data
    console.log("📥 Importing ICMR data...");
    const icmrResponse = await fetch(`${API_URL}/api/data/import/icmr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(ADMIN_TOKEN && { Authorization: `Bearer ${ADMIN_TOKEN}` }),
      },
      body: JSON.stringify({}), // Empty body triggers mock data
    });

    if (icmrResponse.ok) {
      const icmrData = await icmrResponse.json();
      console.log(`  ✅ ICMR: ${icmrData.imported || 0} diseases imported`);
    } else {
      const error = await icmrResponse.json();
      console.log(`  ❌ ICMR import failed: ${error.message}`);
    }

    // 2. Import MoHFW data
    console.log("\n📥 Importing MoHFW outbreak data...");
    const mohfwResponse = await fetch(`${API_URL}/api/data/import/mohfw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(ADMIN_TOKEN && { Authorization: `Bearer ${ADMIN_TOKEN}` }),
      },
      body: JSON.stringify({}), // Empty body triggers mock data
    });

    if (mohfwResponse.ok) {
      const mohfwData = await mohfwResponse.json();
      console.log(`  ✅ MoHFW: ${mohfwData.imported || 0} outbreaks imported`);
    } else {
      const error = await mohfwResponse.json();
      console.log(`  ❌ MoHFW import failed: ${error.message}`);
    }

    // 3. Import VRDL data
    console.log("\n📥 Importing VRDL data...");
    const vrdlResponse = await fetch(`${API_URL}/api/data/import/vrdl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(ADMIN_TOKEN && { Authorization: `Bearer ${ADMIN_TOKEN}` }),
      },
      body: JSON.stringify({}), // Empty body triggers mock data
    });

    if (vrdlResponse.ok) {
      const vrdlData = await vrdlResponse.json();
      console.log(`  ✅ VRDL: ${vrdlData.imported || 0} diseases imported`);
    } else {
      const error = await vrdlResponse.json();
      console.log(`  ❌ VRDL import failed: ${error.message}`);
    }

    console.log("\n✅ Mock data import complete!");
    console.log("\n📝 Note: If imports failed due to auth, login as admin first and set ADMIN_TOKEN in .env");

  } catch (error) {
    console.error("❌ Error importing mock data:", error);
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (response.ok) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

(async () => {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error("❌ Backend server is not running!");
    console.error(`   Please start the server first: pnpm dev`);
    process.exit(1);
  }

  await importMockData();
})();

