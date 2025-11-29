from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database Configuration
    mysql_url: str = "mysql://root:KRI27@ks@localhost:3306/lokai"
    redis_url: str = "redis://localhost:6379"
    
    # Application Configuration
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Environment
    environment: str = "development"
    debug: bool = True
    
    # CORS Configuration
    allowed_origins: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174"]
    
    # Rate Limiting
    
    # Twilio Configuration
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_phone_number: str = ""
    
    # Gmail Configuration
    gmail_email: str = ""
    gmail_app_password: str = ""
    
    # Supabase Configuration
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Create global settings instance
settings = Settings()
