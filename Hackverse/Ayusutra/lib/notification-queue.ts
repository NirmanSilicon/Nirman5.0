import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const redis = new Redis(redisUrl);

const QUEUE_KEY = "ayusutra:notifications";
const DELAYED_KEY = "ayusutra:notifications:delayed"; // sorted set by timestamp
const DLQ_KEY = "ayusutra:notifications:dead"; // dead-letter queue (list)

export async function enqueueNotification(job: Record<string, unknown>) {
  try {
    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    return true;
  } catch (err) {
    console.error("Failed to enqueue notification job:", err);
    return false;
  }
}

export async function enqueueNotificationWithDelay(
  job: Record<string, unknown>,
  delayMs: number
) {
  try {
    const score = Date.now() + Math.max(0, Number(delayMs) || 0);
    await redis.zadd(DELAYED_KEY, score.toString(), JSON.stringify(job));
    return true;
  } catch (err) {
    console.error("Failed to enqueue delayed notification job:", err);
    return false;
  }
}

export async function dequeueNotification(): Promise<Record<
  string,
  unknown
> | null> {
  try {
    const item = await redis.rpop(QUEUE_KEY);
    if (!item) return null;
    return JSON.parse(item) as Record<string, unknown>;
  } catch (err) {
    console.error("Failed to dequeue notification job:", err);
    return null;
  }
}

/**
 * Move due jobs from delayed sorted set to the ready list.
 * Should be called periodically by a worker process.
 */
export async function moveDueDelayedJobsToReady(maxCount = 100) {
  try {
    const now = Date.now();
    // Get jobs with score <= now
    const items = await redis.zrangebyscore(
      DELAYED_KEY,
      0,
      now,
      "LIMIT",
      0,
      maxCount
    );
    if (!items || items.length === 0) return 0;

    const pipeline = redis.pipeline();
    for (const item of items) {
      // remove from delayed set and push to queue
      pipeline.zrem(DELAYED_KEY, item);
      pipeline.lpush(QUEUE_KEY, item);
    }
    await pipeline.exec();
    return items.length;
  } catch (err) {
    console.error("Failed to move delayed jobs to ready queue:", err);
    return 0;
  }
}

export async function moveToDeadLetter(
  job: Record<string, unknown>,
  reason?: string
) {
  try {
    const payload = {
      job,
      reason: reason || null,
      movedAt: new Date().toISOString(),
    };
    await redis.lpush(DLQ_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error("Failed to move job to dead-letter queue:", err);
    return false;
  }
}

export async function listDeadLetters(limit = 50) {
  try {
    const items: string[] = await redis.lrange(DLQ_KEY, 0, limit - 1);
    return items.map((i: string) => {
      try {
        return JSON.parse(i);
      } catch (_e: unknown) {
        return { raw: i };
      }
    });
  } catch (err: unknown) {
    console.error("Failed to list dead-letter items:", err);
    return [];
  }
}

export async function requeueDeadLetterByIndex(index = 0) {
  try {
    const item = await redis.lindex(DLQ_KEY, index);
    if (!item) return { ok: false, reason: "Not found" };
    // parse payload
    const payload = JSON.parse(item);
    const job = payload.job || payload;
    // push job back to ready queue
    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    // remove the specific item from DLQ (remove 1 occurrence)
    await redis.lrem(DLQ_KEY, 1, item);
    return { ok: true };
  } catch (err: unknown) {
    console.error("Failed to requeue dead-letter item:", err);
    return { ok: false, reason: String(err) };
  }
}

export async function queueLength() {
  return await redis.llen(QUEUE_KEY);
}

export async function delayedLength() {
  return await redis.zcard(DELAYED_KEY);
}

export async function deadLetterLength() {
  return await redis.llen(DLQ_KEY);
}
