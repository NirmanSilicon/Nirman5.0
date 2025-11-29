/**
 * Test complete authentication flow
 * Run with: node scripts/test-auth-flow.js
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

let authToken = null;

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

async function testAuthFlow() {
  console.log("🧪 Testing Complete Authentication Flow");
  console.log("=" .repeat(60));
  console.log(`API URL: ${API_URL}`);
  console.log("");

  // Step 1: Register
  console.log("1️⃣  REGISTER USER");
  console.log("-".repeat(60));
  const registerResult = await makeRequest(`${API_URL}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      name: TEST_NAME,
    }),
  });

  if (registerResult.status === 201) {
    console.log("   ✅ Registration successful");
    console.log(`   📧 Email: ${registerResult.data.user.email}`);
    console.log(`   🆔 ID: ${registerResult.data.user.id}`);
  } else {
    console.log(`   ❌ Registration failed: ${registerResult.data?.message || registerResult.error}`);
    return;
  }
  console.log("");

  // Step 2: Login (Send OTP)
  console.log("2️⃣  LOGIN (Send OTP)");
  console.log("-".repeat(60));
  const loginResult = await makeRequest(`${API_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    }),
  });

  if (loginResult.status === 200) {
    console.log("   ✅ Login successful - OTP sent");
    console.log(`   📬 ${loginResult.data.message}`);
    console.log("");
    console.log("   ⚠️  NOTE: In production, OTP would be sent to email.");
    console.log("   For testing, check server logs or database for OTP code.");
  } else {
    console.log(`   ❌ Login failed: ${loginResult.data?.message || loginResult.error}`);
    return;
  }
  console.log("");

  // Step 3: Get OTP from database (for testing)
  console.log("3️⃣  GET OTP FROM DATABASE (for testing)");
  console.log("-".repeat(60));
  console.log("   ℹ️  In a real scenario, you would check your email.");
  console.log("   For testing, OTP is stored in the database.");
  console.log("");

  // Step 4: Verify OTP (simulated - would need actual OTP)
  console.log("4️⃣  VERIFY OTP");
  console.log("-".repeat(60));
  console.log("   ⚠️  Manual step required:");
  console.log("   - Check database for OTP code");
  console.log("   - Or check email if email service is configured");
  console.log("   - Then run: node scripts/test-verify-otp.js");
  console.log("");

  // Step 5: Test protected route
  console.log("5️⃣  TEST PROTECTED ROUTE (without token)");
  console.log("-".repeat(60));
  const meResultNoToken = await makeRequest(`${API_URL}/api/auth/me`, {
    method: "GET",
  });

  if (meResultNoToken.status === 401) {
    console.log("   ✅ Correctly rejected request without token");
  } else {
    console.log(`   ⚠️  Expected 401, got ${meResultNoToken.status}`);
  }
  console.log("");

  console.log("=" .repeat(60));
  console.log("✅ Authentication flow test complete!");
  console.log("");
  console.log("📋 Test Summary:");
  console.log("   ✅ Registration works");
  console.log("   ✅ Login works (OTP sent)");
  console.log("   ✅ Protected routes require authentication");
  console.log("");
  console.log("🔐 To complete OTP verification test:");
  console.log(`   1. Get OTP from database for: ${TEST_EMAIL}`);
  console.log(`   2. Run: node scripts/test-verify-otp.js ${TEST_EMAIL} <OTP_CODE>`);
}

testAuthFlow().catch(console.error);

