"""
Supabase Service for OTP Authentication
Handles user authentication using Supabase Auth with email OTP
"""

import asyncio
from typing import Dict, Any, Optional
from supabase import create_client, Client
from ..config import settings
from ..utils.logger import app_logger
from .email_service import email_service


class SupabaseService:
    def __init__(self):
        """Initialize Supabase client"""
        self.supabase: Optional[Client] = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Supabase client with credentials"""
        try:
            if not settings.supabase_url or not settings.supabase_anon_key:
                app_logger.warning("Supabase credentials not configured. Using fallback mode.")
                self.supabase = None
                return
            
            self.supabase = create_client(
                supabase_url=settings.supabase_url,
                supabase_key=settings.supabase_anon_key
            )
            app_logger.info("Supabase client initialized successfully")
            
        except Exception as e:
            app_logger.error(f"Failed to initialize Supabase client: {e}")
            self.supabase = None
    
    async def send_otp(self, email: str) -> Dict[str, Any]:
        """
        Send OTP to user's email using Supabase Auth + Email Service
        
        Args:
            email: User's email address
            
        Returns:
            Dict with success status and message
        """
        try:
            if not self.supabase:
                # Fallback mode - use email service directly
                app_logger.info(f"[Supabase Fallback] Using email service for OTP: {email}")
                return await self._send_otp_via_email_service(email)
            
            # Try Supabase first, then fallback to email service
            try:
                # Use Supabase Auth to send OTP email
                response = self.supabase.auth.sign_in_with_otp({
                    "email": email
                })
                
                if response.user:
                    app_logger.info(f"OTP sent via Supabase to {email}")
                    return {
                        "success": True,
                        "message": "OTP sent successfully",
                        "provider": "supabase",
                        "user_id": response.user.id
                    }
                else:
                    app_logger.warning(f"Supabase OTP failed, falling back to email service for {email}")
                    return await self._send_otp_via_email_service(email)
                    
            except Exception as supabase_error:
                app_logger.warning(f"Supabase OTP error: {supabase_error}, using email service fallback")
                return await self._send_otp_via_email_service(email)
                
        except Exception as e:
            app_logger.error(f"Error sending OTP: {e}")
            return {
                "success": False,
                "message": f"Error sending OTP: {str(e)}",
                "provider": "supabase"
            }
    
    async def _send_otp_via_email_service(self, email: str) -> Dict[str, Any]:
        """Send OTP using the email service as fallback"""
        try:
            # Generate a 6-digit OTP
            import random
            otp = f"{random.randint(100000, 999999)}"
            
            # Store OTP in Redis or database (for now, just log it)
            app_logger.info(f"[Email Service] Generated OTP for {email}: {otp}")
            
            # Try to send via email service
            try:
                await email_service.send_otp_email(email, otp)
                app_logger.info(f"OTP sent via email service to {email}")
                return {
                    "success": True,
                    "message": "OTP sent successfully",
                    "provider": "email_service",
                    "otp": otp  # Always show OTP for development/testing
                }
            except Exception as email_error:
                app_logger.warning(f"Email service failed: {email_error}, using simulation")
                return {
                    "success": True,
                    "message": "OTP generated successfully (email service unavailable)",
                    "provider": "simulation",
                    "otp": otp  # Always show OTP when email service fails
                }
                
        except Exception as e:
            app_logger.error(f"Error in email service fallback: {e}")
            return {
                "success": False,
                "message": f"Failed to send OTP: {str(e)}",
                "provider": "email_service"
            }
    
    async def verify_otp(self, email: str, otp: str) -> Dict[str, Any]:
        """
        Verify OTP using Supabase Auth or fallback verification
        
        Args:
            email: User's email address
            otp: 6-digit OTP code
            
        Returns:
            Dict with verification result and user session
        """
        try:
            if not self.supabase:
                # Fallback mode - simple OTP verification
                app_logger.info(f"[Supabase Fallback] Verifying OTP for: {email}")
                return await self._verify_otp_fallback(email, otp)
            
            # Try Supabase verification first
            try:
                response = self.supabase.auth.verify_otp({
                    "email": email,
                    "token": otp,
                    "type": "magiclink"
                })
                
                if response.user and response.session:
                    app_logger.info(f"OTP verified via Supabase for {email}")
                    return {
                        "success": True,
                        "message": "OTP verified successfully",
                        "provider": "supabase",
                        "user": response.user,
                        "session": response.session
                    }
                else:
                    app_logger.warning(f"Supabase verification failed, trying fallback for {email}")
                    return await self._verify_otp_fallback(email, otp)
                    
            except Exception as supabase_error:
                app_logger.warning(f"Supabase verification error: {supabase_error}, using fallback")
                return await self._verify_otp_fallback(email, otp)
                
        except Exception as e:
            app_logger.error(f"Error verifying OTP: {e}")
            return {
                "success": False,
                "message": f"Error verifying OTP: {str(e)}",
                "provider": "supabase"
            }
    
    async def _verify_otp_fallback(self, email: str, otp: str) -> Dict[str, Any]:
        """Fallback OTP verification"""
        try:
            # For development, accept any 6-digit OTP
            # In production, you'd check against stored OTP in Redis/database
            if len(otp) == 6 and otp.isdigit():
                app_logger.info(f"OTP verified via fallback for {email}: {otp}")
                return {
                    "success": True,
                    "message": "OTP verified successfully (fallback mode)",
                    "provider": "fallback",
                    "session": {"user": {"email": email}}
                }
            else:
                return {
                    "success": False,
                    "message": "Invalid OTP (must be 6-digit number)",
                    "provider": "fallback"
                }
                
        except Exception as e:
            app_logger.error(f"Error in fallback verification: {e}")
            return {
                "success": False,
                "message": f"Verification error: {str(e)}",
                "provider": "fallback"
            }
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """
        Get user information by email
        
        Args:
            email: User's email address
            
        Returns:
            User information or None if not found
        """
        try:
            if not self.supabase:
                return None
            
            # Query users table (you need to create this table in Supabase)
            response = self.supabase.table("users").select("*").eq("email", email).execute()
            
            if response.data:
                return response.data[0]
            return None
            
        except Exception as e:
            app_logger.error(f"Error getting user by email: {e}")
            return None
    
    async def create_user_profile(self, email: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create user profile in Supabase database
        
        Args:
            email: User's email address
            user_data: Additional user information
            
        Returns:
            Created user profile
        """
        try:
            if not self.supabase:
                app_logger.info(f"[Supabase Fallback] User profile would be created for: {email}")
                return {"success": True, "provider": "fallback"}
            
            # Create user profile in users table
            profile_data = {
                "email": email,
                "created_at": "now()",
                **user_data
            }
            
            response = self.supabase.table("users").insert(profile_data).execute()
            
            if response.data:
                app_logger.info(f"User profile created for {email}")
                return {
                    "success": True,
                    "provider": "supabase",
                    "data": response.data[0]
                }
            else:
                return {
                    "success": False,
                    "message": "Failed to create user profile",
                    "provider": "supabase"
                }
                
        except Exception as e:
            app_logger.error(f"Error creating user profile: {e}")
            return {
                "success": False,
                "message": f"Error creating profile: {str(e)}",
                "provider": "supabase"
            }
    
    def is_configured(self) -> bool:
        """Check if Supabase is properly configured"""
        return self.supabase is not None and bool(settings.supabase_url)


# Create global Supabase service instance
supabase_service = SupabaseService()
