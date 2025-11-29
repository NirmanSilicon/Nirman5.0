import asyncio
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.database.mysql import connect_to_mysql, get_pool
from app.utils.logger import app_logger

async def test_mysql_connection():
    """Test MySQL database connection"""
    try:
        print("🔍 Testing MySQL connection...")
        
        # Try to connect to MySQL
        await connect_to_mysql()
        
        # Get the pool and test a simple query
        pool = get_pool()
        
        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                await cursor.execute('SELECT VERSION()')
                version = await cursor.fetchone()
                print(f"✅ MySQL connected successfully!")
                print(f"📊 MySQL version: {version[0]}")
                
                # Check if database exists and tables are created
                await cursor.execute('SHOW TABLES')
                tables = await cursor.fetchall()
                print(f"📋 Tables in database: {[table[0] for table in tables]}")
                
                # Test a simple query on complaints table
                await cursor.execute('SELECT COUNT(*) FROM complaints')
                count = await cursor.fetchone()
                print(f"📝 Total complaints in database: {count[0]}")
                
        print("🎉 MySQL connection test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ MySQL connection failed: {e}")
        app_logger.error(f"MySQL connection test failed: {e}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test_mysql_connection())
    sys.exit(0 if result else 1)
