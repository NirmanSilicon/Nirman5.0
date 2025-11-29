import { Queue, Worker, Job } from "bullmq";

// Keep the connection shape minimal and avoid using `any` to satisfy the linter.
const redisConnection = {
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
};

export const notificationQueue = new Queue("notifications", {
  connection: redisConnection as unknown as object,
});
// QueueScheduler is deprecated in newer versions of bullmq
// export const notificationScheduler = new QueueScheduler("notifications", {
//   connection: redisConnection as unknown as object,
// });

export function createNotificationWorker(
  processor: (job: Job) => Promise<void>
) {
  return new Worker(
    "notifications",
    async (job: Job) => {
      await processor(job);
    },
    { connection: redisConnection as unknown as object }
  );
}
