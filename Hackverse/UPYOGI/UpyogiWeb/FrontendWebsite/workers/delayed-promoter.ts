#!/usr/bin/env node
import { moveDueDelayedJobsToReady } from "@/lib/notification-queue";

async function promoterLoop() {
  console.log("Delayed promoter started");
  while (true) {
    try {
      const moved = await moveDueDelayedJobsToReady(500);
      if (moved > 0) console.log("Promoted", moved, "jobs to ready");
    } catch (err) {
      console.error("Promoter error:", err);
    }
    // Run every 5 seconds
    await new Promise((r) => setTimeout(r, 5000));
  }
}

promoterLoop().catch((err) => {
  console.error("Promoter fatal error:", err);
  process.exit(1);
});
