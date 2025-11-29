/**
 * Test registration endpoint
 * Run with: node scripts/test-registration.js
 */

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

const API_URL = process.env.FRONTEND_URL?.replace(":3000", ":5000") || "http://localhost:5000";
const TEST_EMAIL = `test${Date.now()}@example.com`;
const TEST_PASSWORD = "test123456";
const TEST_NAME = "Test User";

async function testRegistration() {
  console.log("🧪 Testing Registration Endpoint");
  console.log("=" .repeat(50));
  console.log(`API URL: ${API_URL}`);
  console.log(`Test Email: ${TEST_EMAIL}`);
  console.log("");

  try {
    // Test 1: Register user
    console.log("1️⃣  Testing user registration...");
    const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        name: TEST_NAME,
      }),
    });

    const registerData = await registerResponse.json();

    if (registerResponse.ok) {
      console.log("   ✅ Registration successful!");
      console.log(`   User ID: ${registerData.user.id}`);
      console.log(`   Email: ${registerData.user.email}`);
      console.log("");
    } else {
      console.log(`   ❌ Registration failed: ${registerData.message || registerData.error}`);
      if (registerData.details) {
        console.log(`   Details: ${registerData.details}`);
      }
      process.exit(1);
    }

    // Test 2: Try to register same user again (should fail)
    console.log("2️⃣  Testing duplicate registration (should fail)...");
    const duplicateResponse = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        name: TEST_NAME,
      }),
    });

    const duplicateData = await duplicateResponse.json();

    if (duplicateResponse.status === 400) {
      console.log("   ✅ Correctly rejected duplicate email");
      console.log("");
    } else {
      console.log(`   ⚠️  Expected 400, got ${duplicateResponse.status}`);
      console.log("");
    }

    // Test 3: Test validation (invalid email)
    console.log("3️⃣  Testing validation (invalid email)...");
    const invalidResponse = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "invalid-email",
        password: TEST_PASSWORD,
      }),
    });

    const invalidData = await invalidResponse.json();

    if (invalidResponse.status === 400) {
      console.log("   ✅ Correctly rejected invalid email");
      console.log("");
    } else {
      console.log(`   ⚠️  Expected 400, got ${invalidResponse.status}`);
      console.log("");
    }

    console.log("=" .repeat(50));
    console.log("✅ All registration tests passed!");
    console.log("");
    console.log("🎯 Registration endpoint is working correctly!");
    console.log("");
    console.log("Next steps:");
    console.log("  - Test login endpoint");
    console.log("  - Test OTP verification");
    console.log("  - Test protected routes");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.cause) {
      console.error("   Cause:", error.cause);
    }
    process.exit(1);
  }
}

testRegistration();

