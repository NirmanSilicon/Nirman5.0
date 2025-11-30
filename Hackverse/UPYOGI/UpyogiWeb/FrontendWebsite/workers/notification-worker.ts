#!/usr/bin/env node
import twilio from "twilio";
import {
  dequeueNotification,
  enqueueNotificationWithDelay,
  moveDueDelayedJobsToReady,
  moveToDeadLetter,
} from "@/lib/notification-queue";
import { getBookingById } from "@/lib/database";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID?.replace(/'/g, ""),
  process.env.TWILIO_AUTH_TOKEN?.replace(/'/g, "")
);

async function processJob(job: Record<string, any>) {
  if (!job || !job.type) return;

  const bookingId = job.bookingId;
  const booking = bookingId ? await getBookingById(bookingId) : null;

  // Resolve common fields
  const phoneNumber = job.phoneNumber || booking?.metadata?.phoneNumber;
  const userName = job.userName || booking?.metadata?.userName || "Guest";
  // Format phone similar to API
  if (!phoneNumber) {
    throw new Error(`No phone number for job ${bookingId || "<no-booking>"}`);
  }

  let formattedPhone = String(phoneNumber);
  if (!formattedPhone.startsWith("+")) {
    if (formattedPhone.startsWith("91")) {
      formattedPhone = "+" + formattedPhone;
    } else if (formattedPhone.startsWith("0")) {
      formattedPhone = "+91" + formattedPhone.substring(1);
    } else {
      formattedPhone = "+91" + formattedPhone;
    }
  }

  // Build message per job type
  let message = "";
  if (job.type === "booking_confirmation") {
    const therapyName = job.therapyName || booking?.therapy_name || "therapy";
    const clinicName =
      job.clinicName || booking?.metadata?.clinicName || "Your Clinic";
    const selectedDate = job.selectedDate || booking?.selected_date;
    const selectedTime = job.selectedTime || booking?.selected_time;
    const amount = job.amount ?? booking?.amount;

    const bookingDate = selectedDate ? new Date(selectedDate) : null;
    const formattedDate = bookingDate
      ? bookingDate.toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    message = `🎉 *Booking Confirmed!*\n\nHello ${userName},\n\nYour Ayurvedic treatment booking has been successfully confirmed!\n\n📋 *Booking Details:*\n• Treatment: ${therapyName}\n• Clinic: ${clinicName}\n• Date: ${formattedDate}\n• Time: ${selectedTime}\n• Amount: ${amount}\n\nNamaste 🙏\nupyogi Team`;
  } else if (job.type === "payment_confirmation") {
    const amount = job.amount ?? booking?.amount ?? 0;
    const currency = (job.currency || booking?.currency || "INR").toUpperCase();
    message = `✅ *Payment Received*\n\nHello ${userName},\n\nWe have received your payment of ${amount} ${currency} for booking ${bookingId}. Thank you!\n\nupyogi Team`;
  } else if (job.type === "payment_failed") {
    const amount = job.amount ?? booking?.amount ?? 0;
    const currency = (job.currency || booking?.currency || "INR").toUpperCase();
    message = `⚠️ *Payment Failed*\n\nHello ${userName},\n\nWe were unable to process your payment of ${amount} ${currency} for booking ${bookingId}. Please try again or contact support.\n\nupyogi Team`;
  } else {
    // Unknown job type — throw to move to DLQ after retries
    throw new Error(`Unknown job type: ${job.type}`);
  }

  console.log("Sending WhatsApp to", formattedPhone, "for job", job.type);
  const whatsappResponse = await client.messages.create({
    body: message,
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${formattedPhone}`,
  });
  console.log("WhatsApp sent:", whatsappResponse.sid);

  // Optional: send SMS (may fail in trial)
  try {
    const smsResponse = await client.messages.create({
      body: message,
      from: process.env.TWILIO_SMS_NUMBER || process.env.TWILIO_WHATSAPP_NUMBER,
      to: formattedPhone,
    });
    console.log("SMS sent:", smsResponse.sid);
  } catch (smsErr: any) {
    console.warn("SMS send failed (non-fatal):", smsErr?.message || smsErr);
  }
}

async function workerLoop() {
  console.log("Notification worker started");
  const MAX_ATTEMPTS = Number(process.env.NOTIFY_MAX_ATTEMPTS || 3);
  while (true) {
    try {
      // Promote due delayed jobs to ready queue
      await moveDueDelayedJobsToReady(50);

      const job = await dequeueNotification();
      if (!job) {
        // sleep for a short time when queue empty
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      try {
        await processJob(job as Record<string, any>);
      } catch (procErr: any) {
        console.error("Job processing failed:", procErr?.message || procErr);
        // handle retry/backoff
        const attempts = (job.attempts as number) || 0;
        const nextAttempts = attempts + 1;
        if (nextAttempts <= MAX_ATTEMPTS) {
          // exponential backoff: base 2000ms * 2^(attempts)
          const delayMs = 2000 * Math.pow(2, attempts);
          const newJob = { ...job, attempts: nextAttempts };
          await enqueueNotificationWithDelay(
            newJob as Record<string, unknown>,
            delayMs
          );
          console.log(
            `Re-enqueued job ${job.bookingId} for attempt ${nextAttempts} after ${delayMs}ms`
          );
        } else {
          // move to dead-letter queue
          await moveToDeadLetter(
            job as Record<string, unknown>,
            String(procErr?.message || procErr)
          );
          console.warn(
            `Moved job ${job.bookingId} to dead-letter after ${
              nextAttempts - 1
            } attempts`
          );
        }
      }
    } catch (err: any) {
      console.error("Worker loop error:", err?.message || err);
      // wait before retrying
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

workerLoop().catch((err: any) => {
  console.error("Worker fatal error:", err);
  process.exit(1);
});
