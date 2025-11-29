/**
 * Entry point for PathoGen Backend Server
 * 
 * This file provides a fallback entry point.
 * Recommended usage:
 *   - Development: pnpm dev (uses tsx watch)
 *   - Production: pnpm build && pnpm start
 */

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const distPath = join(__dirname, "dist", "index.js");
  const srcPath = join(__dirname, "src", "index.ts");

  if (existsSync(distPath)) {
    // Production: use built version
    console.log("📦 Starting server from built version...");
    try {
      await import(`file://${distPath}`);
    } catch (error) {
      if (error.code === "EADDRINUSE") {
        // Port conflict - error is already handled in index.ts
        return;
      }
      throw error;
    }
  } else {
    // Development: use tsx to run TypeScript directly
    console.log("🔧 Starting server in development mode...");
    console.log("💡 Tip: For production, run 'pnpm build && pnpm start'");
    console.log("💡 For development with hot reload, use 'pnpm dev'");
    
    try {
      // Register tsx to handle TypeScript
      const { register } = await import("tsx/esm/api");
      register();
      await import(`file://${srcPath}`);
    } catch (error) {
      if (error.code === "EADDRINUSE") {
        // Port conflict - error is already handled in index.ts
        return;
      }
      console.error("❌ Error starting server:", error.message);
      console.error("\n💡 Make sure you:");
      console.error("   1. Have installed dependencies: pnpm install");
      console.error("   2. For development: pnpm dev");
      console.error("   3. For production: pnpm build && pnpm start");
      process.exit(1);
    }
  }
}

startServer().catch((error) => {
  // Don't log EADDRINUSE here as it's handled in index.ts
  if (error.code !== "EADDRINUSE") {
    console.error("❌ Failed to start server:", error);
  }
  process.exit(1);
});

