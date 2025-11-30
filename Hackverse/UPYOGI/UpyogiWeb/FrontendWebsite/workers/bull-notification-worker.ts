#!/usr/bin/env node
import twilio from "twilio";
import { createNotificationWorker } from "@/lib/bull-queue";
import { getBookingById } from "@/lib/database";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID?.replace(/'/g, ""),
  process.env.TWILIO_AUTH_TOKEN?.replace(/'/g, "")
);

async function processor(job: any) {
  const data = job.data;
  if (!data || data.type !== "booking_confirmation") return;

  const booking = await getBookingById(data.bookingId);
  if (!booking) {
    console.error("Booking not found for job", data.bookingId);
    return;
  }

  const phoneNumber = data.phoneNumber || booking.metadata?.phoneNumber;
  const userName = data.userName || booking.metadata?.userName || "Guest";
  const therapyName = data.therapyName || booking.therapy_name;
  const clinicName =
    data.clinicName || booking.metadata?.clinicName || "Your Clinic";
  const selectedDate = data.selectedDate || booking.selected_date;
  const selectedTime = data.selectedTime || booking.selected_time;
  const amount = data.amount ?? booking.amount;

  if (!phoneNumber) {
    console.error("No phone number for booking", data.bookingId);
    return;
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

  const bookingDate = new Date(selectedDate);
  const formattedDate = bookingDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const message = `🎉 *Booking Confirmed!*\n\nHello ${userName},\n\nYour Ayurvedic treatment booking has been successfully confirmed!\n\n📋 *Booking Details:*\n• Treatment: ${therapyName}\n• Clinic: ${clinicName}\n• Date: ${formattedDate}\n• Time: ${selectedTime}\n• Amount: ${amount}\n\nNamaste 🙏\nAyurSutra Team`;

  console.log("Sending WhatsApp to", formattedPhone);
  const whatsappResponse = await client.messages.create({
    body: message,
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${formattedPhone}`,
  });
  console.log("WhatsApp sent:", whatsappResponse.sid);
}

createNotificationWorker(processor);

console.log("Bull notification worker started");
