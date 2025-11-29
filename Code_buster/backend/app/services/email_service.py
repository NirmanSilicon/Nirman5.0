"""Email Service for sending OTP messages via Gmail"""
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ..config import settings
from ..utils.logger import app_logger
from typing import Dict, Any


class EmailService:
    """Email service for sending OTP and notifications via Gmail"""
    
    def __init__(self):
        """Initialize Gmail SMTP client"""
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.gmail_enabled = False
        
        if settings.gmail_email and settings.gmail_app_password:
            self.gmail_enabled = True
            app_logger.info("Gmail service configured successfully")
        else:
            app_logger.warning("Gmail credentials not configured. Email will use fallback method.")
    
    async def send_otp_email(self, email: str, otp: str) -> Dict[str, Any]:
        """
        Send OTP via Email using Gmail SMTP (dedicated method for Supabase service)
        
        Args:
            email: Email address to send OTP to
            otp: 6-digit OTP code
        """
        return await self.send_otp(email, otp)
    
    async def send_otp(self, email: str, otp: str) -> Dict[str, Any]:
        """
        Send OTP via Email using Gmail SMTP
        
        Args:
            email: Email address to send OTP to
            otp: 6-digit OTP code
        """
        try:
            subject = "LokAI - One-Time Password (OTP)"
            message_body = f"""
            <html>
            <body>
                <h2>LokAI - OTP Verification</h2>
                <p>Dear User,</p>
                <p>Your One-Time Password (OTP) for LokAI is: <strong style="font-size: 24px; color: #007bff;">{otp}</strong></p>
                <p>This OTP is valid for <strong>5 minutes</strong>.</p>
                <p><strong>Important:</strong> Do not share this code with anyone for security reasons.</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    This is an automated message from LokAI - AI for Smarter Cities.<br>
                    If you didn't request this OTP, please ignore this email.
                </p>
            </body>
            </html>
            """
            
            if self.gmail_enabled:
                # Send via Gmail SMTP
                try:
                    message = MIMEMultipart("alternative")
                    message["Subject"] = subject
                    message["From"] = settings.gmail_email
                    message["To"] = email
                    
                    # Attach HTML body
                    html_part = MIMEText(message_body, "html")
                    message.attach(html_part)
                    
                    # Create SMTP session
                    server = smtplib.SMTP(self.smtp_server, self.smtp_port)
                    server.starttls()  # Secure the connection
                    
                    # Login with email and app password
                    server.login(settings.gmail_email, settings.gmail_app_password)
                    
                    # Send email
                    server.send_message(message)
                    server.quit()
                    
                    app_logger.info(f"[Gmail Email] OTP sent to {email}")
                    return {
                        "success": True,
                        "message": f"OTP sent to {email}",
                        "provider": "gmail",
                        "email": email
                    }
                except Exception as e:
                    app_logger.error(f"Gmail error sending email to {email}: {e}")
                    return {
                        "success": False,
                        "message": f"Failed to send email: {str(e)}",
                        "provider": "gmail",
                        "error": str(e)
                    }
            else:
                # Fallback: log the OTP (for development/testing)
                if settings.debug:
                    app_logger.info(f"[Email Fallback] OTP to {email}: {otp}")
                    return {
                        "success": True,
                        "message": f"Email would be sent to {email}",
                        "otp_for_testing": otp,
                        "provider": "fallback",
                        "note": "In development mode - Gmail not configured"
                    }
                else:
                    app_logger.warning(f"Email not sent to {email} - Gmail not configured in production")
                    return {
                        "success": False,
                        "message": "Email service not configured",
                        "provider": "none"
                    }
                
        except Exception as e:
            app_logger.error(f"Error sending OTP to {email}: {e}")
            return {
                "success": False,
                "message": "Failed to send OTP",
                "error": str(e)
            }
    
    async def send_complaint_update(self, email: str, complaint_id: str, status: str) -> Dict[str, Any]:
        """Send complaint status update via Email"""
        try:
            subject = f"LokAI - Complaint Update: {complaint_id}"
            message_body = f"""
            <html>
            <body>
                <h2>LokAI - Complaint Status Update</h2>
                <p>Dear User,</p>
                <p>Your complaint has been updated:</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0;">
                    <p><strong>Complaint ID:</strong> {complaint_id}</p>
                    <p><strong>New Status:</strong> <span style="color: #28a745; font-weight: bold;">{status}</span></p>
                </div>
                <p>You can check the full details by logging into your LokAI account.</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    This is an automated message from LokAI - AI for Smarter Cities.<br>
                    For any queries, please contact our support team.
                </p>
            </body>
            </html>
            """
            
            if self.gmail_enabled:
                try:
                    message = MIMEMultipart("alternative")
                    message["Subject"] = subject
                    message["From"] = settings.gmail_email
                    message["To"] = email
                    
                    # Attach HTML body
                    html_part = MIMEText(message_body, "html")
                    message.attach(html_part)
                    
                    # Create SMTP session
                    server = smtplib.SMTP(self.smtp_server, self.smtp_port)
                    server.starttls()  # Secure the connection
                    
                    # Login with email and app password
                    server.login(settings.gmail_email, settings.gmail_app_password)
                    
                    # Send email
                    server.send_message(message)
                    server.quit()
                    
                    app_logger.info(f"[Gmail Email] Status update sent to {email}")
                    return {
                        "success": True,
                        "message": f"Status update sent to {email}",
                        "provider": "gmail",
                        "email": email
                    }
                except Exception as e:
                    app_logger.error(f"Gmail error sending status update to {email}: {e}")
                    return {
                        "success": False,
                        "message": f"Failed to send update: {str(e)}",
                        "provider": "gmail",
                        "error": str(e)
                    }
            else:
                app_logger.info(f"[Email Fallback] Status update to {email}: {message_body}")
                return {
                    "success": True,
                    "message": f"Status update logged for {email}",
                    "provider": "fallback"
                }
            
        except Exception as e:
            app_logger.error(f"Error sending status update to {email}: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def send_welcome_email(self, email: str, name: str) -> Dict[str, Any]:
        """Send welcome email to new users"""
        try:
            subject = "Welcome to LokAI - AI for Smarter Cities"
            message_body = f"""
            <html>
            <body>
                <h2 style="color: #007bff;">Welcome to LokAI! 🎉</h2>
                <p>Dear {name},</p>
                <p>Welcome to <strong>LokAI - AI for Smarter Cities</strong>! We're excited to have you join our community.</p>
                
                <h3>What you can do with LokAI:</h3>
                <ul>
                    <li>📝 File and track complaints</li>
                    <li>🏙️ Report civic issues</li>
                    <li>📊 Monitor city services</li>
                    <li>🤖 Get AI-powered assistance</li>
                </ul>
                
                <p>Get started by logging into your account and exploring all the features available to you.</p>
                
                <div style="background-color: #007bff; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    <p style="margin: 0; font-size: 16px;">Thank you for choosing LokAI!</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px;">Making cities smarter, together.</p>
                </div>
                
                <hr>
                <p style="color: #666; font-size: 12px;">
                    This is an automated message from LokAI - AI for Smarter Cities.<br>
                    If you have any questions, please don't hesitate to contact our support team.
                </p>
            </body>
            </html>
            """
            
            if self.gmail_enabled:
                try:
                    message = MIMEMultipart("alternative")
                    message["Subject"] = subject
                    message["From"] = settings.gmail_email
                    message["To"] = email
                    
                    # Attach HTML body
                    html_part = MIMEText(message_body, "html")
                    message.attach(html_part)
                    
                    # Create SMTP session
                    server = smtplib.SMTP(self.smtp_server, self.smtp_port)
                    server.starttls()  # Secure the connection
                    
                    # Login with email and app password
                    server.login(settings.gmail_email, settings.gmail_app_password)
                    
                    # Send email
                    server.send_message(message)
                    server.quit()
                    
                    app_logger.info(f"[Gmail Email] Welcome email sent to {email}")
                    return {
                        "success": True,
                        "message": f"Welcome email sent to {email}",
                        "provider": "gmail",
                        "email": email
                    }
                except Exception as e:
                    app_logger.error(f"Gmail error sending welcome email to {email}: {e}")
                    return {
                        "success": False,
                        "message": f"Failed to send welcome email: {str(e)}",
                        "provider": "gmail",
                        "error": str(e)
                    }
            else:
                app_logger.info(f"[Email Fallback] Welcome email to {email}")
                return {
                    "success": True,
                    "message": f"Welcome email logged for {email}",
                    "provider": "fallback"
                }
            
        except Exception as e:
            app_logger.error(f"Error sending welcome email to {email}: {e}")
            return {
                "success": False,
                "error": str(e)
            }


# Initialize Email service
email_service = EmailService()
