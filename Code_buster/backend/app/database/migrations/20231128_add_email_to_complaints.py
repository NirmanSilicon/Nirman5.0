"""
Migration to add email field to complaints table
"""
from ..mysql import get_pool
from ...utils.logger import app_logger

async def run_migration():
    """Run the migration to add email field to complaints table"""
    try:
        pool = await get_pool()
        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                # Add email column if it doesn't exist
                await cursor.execute("""
                    SELECT COUNT(*) 
                    FROM information_schema.COLUMNS 
                    WHERE TABLE_SCHEMA = DATABASE() 
                    AND TABLE_NAME = 'complaints' 
                    AND COLUMN_NAME = 'email'
                """)
                result = await cursor.fetchone()
                
                if result and result[0] == 0:
                    # Add email column
                    await cursor.execute("""
                        ALTER TABLE complaints 
                        ADD COLUMN email VARCHAR(255) AFTER name,
                        ADD COLUMN cleaned_text TEXT AFTER complaint_text,
                        MODIFY phone VARCHAR(20) NULL,
                        ADD INDEX idx_email (email)
                    """)
                    
                    # Update existing records with a placeholder email if needed
                    await cursor.execute("""
                        UPDATE complaints 
                        SET email = CONCAT('user_', id, '@example.com')
                        WHERE email IS NULL
                    """)
                    
                    # Make email required for new records
                    await cursor.execute("""
                        ALTER TABLE complaints 
                        MODIFY email VARCHAR(255) NOT NULL
                    """)
                    
                    await conn.commit()
                    app_logger.info("Successfully added email field to complaints table")
                    return True
                
                app_logger.info("Email field already exists in complaints table")
                return True
                
    except Exception as e:
        app_logger.error(f"Error running migration: {str(e)}")
        if 'conn' in locals():
            await conn.rollback()
        raise
