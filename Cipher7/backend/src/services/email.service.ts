import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send OTP email to user
 */
export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error("Email configuration is missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env");
  }

  const mailOptions = {
    from: `PathoGen <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "PathoGen - Your OTP Code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4D9AFF 0%, #1B7BFF 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #FFFFFF; margin: 0;">PathoGen</h1>
            <p style="color: #FFFFFF; margin: 10px 0 0 0;">Public Health Monitoring Platform</p>
          </div>
          
          <div style="background: #FFFFFF; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1A1A1A; margin-top: 0;">Your OTP Code</h2>
            
            <p style="color: #6B7280;">Please use the following One-Time Password (OTP) to complete your login:</p>
            
            <div style="background: #F5F7FA; border: 2px solid #1B7BFF; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1B7BFF; font-family: monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #6B7280; font-size: 14px;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
            
            <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
              If you didn't request this OTP, please ignore this email or contact support.
            </p>
            
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
            
            <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
              This is an automated message from PathoGen. Please do not reply to this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9CA3AF; font-size: 12px;">
            <p>🔒 Your data is encrypted (AES-256) and never shared</p>
          </div>
        </body>
      </html>
    `,
    text: `
PathoGen - Your OTP Code

Your One-Time Password (OTP) is: ${otp}

This OTP is valid for 10 minutes. Do not share this code with anyone.

If you didn't request this OTP, please ignore this email or contact support.

---
PathoGen - Public Health Monitoring Platform
🔒 Your data is encrypted (AES-256) and never shared
    `,
  };

  try {
    await transporter.verify();
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw new Error("Failed to send OTP email. Please check your email configuration.");
  }
}

/**
 * Send generic email (for alerts, notifications, etc.)
 */
export async function sendEmail(email: string, subject: string, html: string, text?: string): Promise<void> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error("Email configuration is missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env");
  }

  const mailOptions = {
    from: `PathoGen <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML tags for text version
  };

  try {
    await transporter.verify();
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}: ${subject}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${email}:`, error);
    throw new Error("Failed to send email. Please check your email configuration.");
  }
}

/**
 * Verify email transporter configuration
 */
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error("❌ Email configuration error:", error);
    return false;
  }
}

