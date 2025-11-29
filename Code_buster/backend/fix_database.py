import asyncio
import aiomysql
from pathlib import Path
import sys

# Add the backend directory to the Python path
sys.path.append(str(Path(__file__).parent))

async def setup_database():
    try:
        # Connect to MySQL server (without specifying a database)
        conn = await aiomysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='KRI27@ks',
            autocommit=True
        )
        
        async with conn.cursor() as cur:
            # Create database if it doesn't exist
            await cur.execute("CREATE DATABASE IF NOT EXISTS lokai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print("Database 'lokai' created or already exists")
            
            # Switch to the database
            await cur.execute("USE lokai")
            
            # Create complaints table
            await cur.execute("""
                CREATE TABLE IF NOT EXISTS complaints (
                    id VARCHAR(36) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    phone VARCHAR(20),
                    latitude DECIMAL(10, 8) NOT NULL,
                    longitude DECIMAL(11, 8) NOT NULL,
                    address TEXT NOT NULL,
                    complaint_text TEXT NOT NULL,
                    cleaned_text TEXT,
                    category ENUM('road', 'water', 'electricity', 'garbage', 'safety', 'health', 'other'),
                    sentiment ENUM('positive', 'neutral', 'negative'),
                    urgency ENUM('low', 'medium', 'high'),
                    confidence_score DECIMAL(3, 2),
                    status ENUM('pending', 'in_progress', 'resolved', 'rejected') DEFAULT 'pending',
                    assigned_to VARCHAR(255),
                    resolved_at TIMESTAMP NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_email (email),
                    INDEX idx_status (status),
                    INDEX idx_created_at (created_at),
                    INDEX idx_category (category)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)
            print("Created 'complaints' table")
            
            # Create OTP table
            await cur.execute("""
                CREATE TABLE IF NOT EXISTS otps (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    phone VARCHAR(20) NOT NULL,
                    email VARCHAR(255),
                    otp_code VARCHAR(6) NOT NULL,
                    attempts INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP NOT NULL,
                    is_verified BOOLEAN DEFAULT FALSE,
                    INDEX idx_phone (phone),
                    INDEX idx_email (email),
                    INDEX idx_expires_at (expires_at)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            """)
            print("Created 'otps' table")
            
            print("\nDatabase setup completed successfully!")
            
    except Exception as e:
        print(f"Error setting up database: {e}")
        raise
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("Setting up database...")
    asyncio.run(setup_database())
