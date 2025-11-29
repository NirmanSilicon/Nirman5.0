"""SMS Service for sending OTP messages via Twilio"""
from ..config import settings
from ..utils.logger import app_logger
from typing import Dict, Any
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException


class SMSService:
    """SMS service for sending OTP and notifications via Twilio"""
    
    def __init__(self):
        """Initialize Twilio client"""
        self.client = None
        self.twilio_enabled = False
        
        if settings.twilio_account_sid and settings.twilio_auth_token and settings.twilio_phone_number:
            try:
                self.client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
                self.twilio_enabled = True
                app_logger.info("Twilio client initialized successfully")
            except Exception as e:
                app_logger.warning(f"Failed to initialize Twilio: {e}")
                self.twilio_enabled = False
        else:
            app_logger.warning("Twilio credentials not configured. SMS will use fallback method.")
    
    async def send_otp(self, phone: str, otp: str) -> Dict[str, Any]:
        """
        Send OTP via SMS using Twilio
        
        Args:
            phone: Phone number with country code (e.g., +1234567890)
            otp: 6-digit OTP code
        """
        try:
            message_body = f"Your LokAI OTP is: {otp}. Valid for 5 minutes. Do not share this code."
            
            if self.twilio_enabled:
                # Send via Twilio
                try:
                    message = self.client.messages.create(
                        body=message_body,
                        from_=settings.twilio_phone_number,
                        to=phone
                    )
                    app_logger.info(f"[Twilio SMS] OTP sent to {phone}, SID: {message.sid}")
                    return {
                        "success": True,
                        "message": f"OTP sent to {phone}",
                        "provider": "twilio",
                        "sms_sid": message.sid
                    }
                except TwilioRestException as e:
                    app_logger.error(f"Twilio error sending SMS to {phone}: {e}")
                    return {
                        "success": False,
                        "message": f"Failed to send SMS: {str(e)}",
                        "provider": "twilio",
                        "error": str(e)
                    }
            else:
                # Fallback: log the OTP (for development/testing)
                if settings.debug:
                    app_logger.info(f"[SMS Fallback] OTP to {phone}: {otp}")
                    return {
                        "success": True,
                        "message": f"SMS would be sent to {phone}",
                        "otp_for_testing": otp,
                        "provider": "fallback",
                        "note": "In development mode - Twilio not configured"
                    }
                else:
                    app_logger.warning(f"SMS not sent to {phone} - Twilio not configured in production")
                    return {
                        "success": False,
                        "message": "SMS service not configured",
                        "provider": "none"
                    }
                
        except Exception as e:
            app_logger.error(f"Error sending OTP to {phone}: {e}")
            return {
                "success": False,
                "message": "Failed to send OTP",
                "error": str(e)
            }
    
    async def send_complaint_update(self, phone: str, complaint_id: str, status: str) -> Dict[str, Any]:
        """Send complaint status update via SMS"""
        try:
            message_body = f"LokAI Update: Your complaint {complaint_id} status is now {status}."
            
            if self.twilio_enabled:
                try:
                    message = self.client.messages.create(
                        body=message_body,
                        from_=settings.twilio_phone_number,
                        to=phone
                    )
                    app_logger.info(f"[Twilio SMS] Status update sent to {phone}, SID: {message.sid}")
                    return {
                        "success": True,
                        "message": f"Status update sent to {phone}",
                        "provider": "twilio"
                    }
                except TwilioRestException as e:
                    app_logger.error(f"Twilio error sending status update to {phone}: {e}")
                    return {
                        "success": False,
                        "message": f"Failed to send update: {str(e)}",
                        "provider": "twilio"
                    }
            else:
                app_logger.info(f"[SMS Fallback] Status update to {phone}: {message_body}")
                return {
                    "success": True,
                    "message": f"Status update logged for {phone}",
                    "provider": "fallback"
                }
            
        except Exception as e:
            app_logger.error(f"Error sending status update to {phone}: {e}")
            return {
                "success": False,
                "error": str(e)
            }


# Initialize SMS service
sms_service = SMSService()
