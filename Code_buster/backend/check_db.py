import asyncio
import aiomysql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_connection():
    try:
        # Get database connection details from environment variables
        db_url = os.getenv("MYSQL_URL", "mysql://root:KRI27@ks@localhost:3306/lokai")
        
        # Parse the database URL
        if db_url.startswith('mysql://'):
            db_url = db_url[8:]
            
        user = "root"
        password = "KRI27@ks"
        host = "localhost"
        port = 3306
        database = "lokai"
        
        if '@' in db_url:
            auth_part, host_part = db_url.split('@', 1)
            if ':' in auth_part:
                user, password = auth_part.split(':', 1)
            else:
                user = auth_part
                
            if '/' in host_part:
                host_port, database = host_part.split('/', 1)
            else:
                host_port = host_part
                
            if ':' in host_port:
                host, port_str = host_port.split(':', 1)
                try:
                    port = int(port_str)
                except ValueError:
                    port = 3306
        
        print(f"Connecting to MySQL: {user}@{host}:{port}/{database}")
        
        # Test connection
        conn = await aiomysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            db=database
        )
        
        async with conn.cursor() as cur:
            await cur.execute("SHOW TABLES;")
            tables = await cur.fetchall()
            print("\nTables in the database:")
            for table in tables:
                print(f"- {table[0]}")
            
            # Check if complaints table exists
            await cur.execute("""
                SELECT COUNT(*) 
                FROM information_schema.TABLES 
                WHERE (TABLE_SCHEMA = %s) AND (TABLE_NAME = 'complaints')
            """, (database,))
            
            exists = await cur.fetchone()
            if exists and exists[0] > 0:
                print("\nComplaints table exists. Checking structure...")
                await cur.execute("DESCRIBE complaints;")
                columns = await cur.fetchall()
                print("\nColumns in complaints table:")
                for col in columns:
                    print(f"- {col[0]} ({col[1]})")
            else:
                print("\nComplaints table does not exist.")
        
        conn.close()
        print("\nDatabase connection test successful!")
        
    except Exception as e:
        print(f"\nError connecting to database: {e}")
        print("\nPlease check:")
        print("1. Is MySQL service running?")
        print("2. Are the database credentials correct?")
        print(f"3. Does the database '{database}' exist?")
        print(f"4. Can you connect using: mysql -u {user} -p{password} -h {host} -P {port} {database}")

if __name__ == "__main__":
    asyncio.run(test_connection())
