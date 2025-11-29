/**
 * Check if a port is available and optionally kill the process using it
 * Usage: node scripts/check-port.js [port] [--kill]
 */

import { execSync } from "child_process";
import { platform } from "os";

const port = process.argv[2] || "5000";
const shouldKill = process.argv.includes("--kill");
const isWindows = platform() === "win32";

function checkPortWindows(port) {
  try {
    const result = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf-8" });
    const lines = result.trim().split("\n").filter(line => line.includes("LISTENING"));
    
    if (lines.length > 0) {
      const pid = lines[0].trim().split(/\s+/).pop();
      console.log(`⚠️  Port ${port} is in use by process ID: ${pid}`);
      
      if (shouldKill) {
        console.log(`🔪 Killing process ${pid}...`);
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: "inherit" });
          console.log(`✅ Process ${pid} killed successfully`);
          return true;
        } catch (error) {
          console.error(`❌ Failed to kill process: ${error.message}`);
          return false;
        }
      } else {
        console.log(`💡 To kill this process, run:`);
        console.log(`   taskkill /F /PID ${pid}`);
        console.log(`   Or run this script with --kill flag`);
        return false;
      }
    } else {
      console.log(`✅ Port ${port} is available`);
      return true;
    }
  } catch (error) {
    // If findstr returns nothing, port is available
    console.log(`✅ Port ${port} is available`);
    return true;
  }
}

function checkPortUnix(port) {
  try {
    const result = execSync(`lsof -ti:${port}`, { encoding: "utf-8" });
    const pid = result.trim();
    
    if (pid) {
      console.log(`⚠️  Port ${port} is in use by process ID: ${pid}`);
      
      if (shouldKill) {
        console.log(`🔪 Killing process ${pid}...`);
        try {
          execSync(`kill -9 ${pid}`, { stdio: "inherit" });
          console.log(`✅ Process ${pid} killed successfully`);
          return true;
        } catch (error) {
          console.error(`❌ Failed to kill process: ${error.message}`);
          return false;
        }
      } else {
        console.log(`💡 To kill this process, run:`);
        console.log(`   kill -9 ${pid}`);
        console.log(`   Or run this script with --kill flag`);
        return false;
      }
    }
  } catch (error) {
    // If lsof returns nothing, port is available
    console.log(`✅ Port ${port} is available`);
    return true;
  }
}

const isAvailable = isWindows ? checkPortWindows(port) : checkPortUnix(port);
process.exit(isAvailable ? 0 : 1);

