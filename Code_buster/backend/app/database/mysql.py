import aiomysql
from aiomysql import Pool
from ..config import settings
from ..utils.logger import app_logger
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MySQL connection pool
pool: Pool = None


async def connect_to_mysql():
    """Connect to MySQL database"""
    global pool
    
    try:
        # Parse database URL (format: mysql://user:password@host:port/database)
        db_url = settings.mysql_url
        if db_url.startswith('mysql://'):
            db_url = db_url[8:]  # Remove 'mysql://' prefix
        
        # Default values
        host = 'localhost'
        port = 3306
        # Default values from environment variables
        user = os.getenv('MYSQL_USER', 'root')
        password = os.getenv('MYSQL_PASSWORD', 'KRI27@ks')
        database = os.getenv('MYSQL_DATABASE', 'lokai')
        host = 'localhost'
        port = 3306
        
        # Parse connection details from URL if provided
        if db_url and '@' in db_url:
            try:
                # Find the last @ to handle passwords containing @
                last_at_pos = db_url.rfind('@')
                auth_part, host_part = db_url[:last_at_pos], db_url[last_at_pos + 1:]
                
                # Parse user:password
                if ':' in auth_part:
                    user, password = auth_part.split(':', 1)
                else:
                    user = auth_part
                
                # Parse host:port/database
                if '/' in host_part:
                    host_port, database = host_part.split('/', 1)
                    
                    # Parse host and port
                    if ':' in host_port:
                        host, port_str = host_port.split(':')
                        try:
                            port = int(port_str)
                        except ValueError:
                            print(f"Warning: Invalid port number {port_str}, using default 3306")
                    else:
                        host = host_port
                
                # Clean up any URL-encoded characters in password
                import urllib.parse
                password = urllib.parse.unquote(password)
                
            except Exception as e:
                print(f"Warning: Error parsing database URL, using defaults. Error: {str(e)}")
            else:
                host_port = host_part
            
            # Parse host:port
            if ':' in host_port:
                host, port_str = host_port.split(':', 1)
                try:
                    port = int(port_str)
                except ValueError:
                    port = 3306
            else:
                host = host_port
        
        # Create connection pool
        pool = await aiomysql.create_pool(
            host=host,
            port=port,
            user=user,
            password=password,
            db=database,
            minsize=5,
            maxsize=20,
            autocommit=False,
            charset='utf8mb4'
        )
        
        # Test the connection
        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                await cursor.execute('SELECT 1')
        
        # Create tables
        await create_tables()
        
        app_logger.info("Successfully connected to MySQL database")
        
    except Exception as e:
        app_logger.error(f"Failed to connect to MySQL: {e}")
        raise


async def close_mysql_connection():
    """Close MySQL connection pool"""
    global pool
    if pool:
        pool.close()
        await pool.wait_closed()
        app_logger.info("Closed MySQL connection")


async def create_tables():
    """Create database tables"""
    try:
        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                
                # Create complaints table
                await cursor.execute("""
                    CREATE TABLE IF NOT EXISTS complaints (
                        id VARCHAR(36) PRIMARY KEY,
                        address TEXT NOT NULL,
                        complaint_text TEXT NOT NULL,
                        category ENUM('road', 'water', 'electricity', 'garbage', 'safety', 'health', 'other') NOT NULL,
                        sentiment ENUM('positive', 'neutral', 'negative') NOT NULL,
                        urgency ENUM('low', 'medium', 'high') NOT NULL,
                        status ENUM('pending', 'in_progress', 'resolved', 'rejected') NOT NULL DEFAULT 'pending',
                        confidence_score DECIMAL(3, 2),
                        cleaned_text TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        assigned_to VARCHAR(255),
                        resolved_at TIMESTAMP NULL,
                        INDEX idx_created_at (created_at),
                        INDEX idx_category (category),
                        INDEX idx_status (status)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                """)
                
                
                # Create dashboard cache table
                await cursor.execute("""
                    CREATE TABLE IF NOT EXISTS dashboard_cache (
                        cache_key VARCHAR(100) PRIMARY KEY,
                        cache_data JSON,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        expires_at TIMESTAMP NOT NULL,
                        INDEX idx_expires_at (expires_at)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                """)
                
                await conn.commit()
                app_logger.info("Created database tables")
                
    except Exception as e:
        app_logger.error(f"Error creating tables: {e}")
        raise


def get_pool():
    """Get database connection pool"""
    if not pool:
        raise Exception("Database not connected")
    return pool


async def get_connection():
    """Get database connection from pool"""
    db_pool = get_pool()
    return await db_pool.acquire()


async def execute_query(query: str, params: tuple = None):
    """Execute a query and return results"""
    async with await get_connection() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            await cursor.execute(query, params)
            return await cursor.fetchall()


async def execute_update(query: str, params: tuple = None):
    """Execute an update query and return affected rows"""
    async with await get_connection() as conn:
        async with conn.cursor() as cursor:
            await cursor.execute(query, params)
            await conn.commit()
            return cursor.rowcount


async def execute_insert(query: str, params: tuple = None):
    """Execute an insert query and return the last insert ID"""
    async with await get_connection() as conn:
        async with conn.cursor() as cursor:
            await cursor.execute(query, params)
            await conn.commit()
            return cursor.lastrowid


# Helper functions for common operations
async def get_complaints_by_category(category: str, limit: int = 100):
    """Get complaints by category"""
    query = """
        SELECT * FROM complaints 
        WHERE category = %s 
        ORDER BY created_at DESC 
        LIMIT %s
    """
    return await execute_query(query, (category, limit))


async def get_dashboard_summary(days: int = 30):
    """Get dashboard summary statistics"""
    query = """
        SELECT 
            COUNT(*) as total_complaints,
            SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_complaints,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_complaints,
            SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_complaints,
            SUM(CASE WHEN urgency = 'high' THEN 1 ELSE 0 END) as high_urgency_complaints
        FROM complaints 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL %s DAY)
    """
    return await execute_query(query, (days,))


async def get_category_distribution(days: int = 30):
    """Get complaint distribution by category"""
    query = """
        SELECT category, COUNT(*) as count
        FROM complaints 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL %s DAY)
        GROUP BY category
        ORDER BY count DESC
    """
    return await execute_query(query, (days,))


async def get_status_distribution(days: int = 30):
    """Get complaint distribution by status"""
    query = """
        SELECT status, COUNT(*) as count
        FROM complaints 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL %s DAY)
        GROUP BY status
        ORDER BY count DESC
    """
    return await execute_query(query, (days,))


async def get_heatmap_data(days: int = 30, category: str = None, status: str = None):
    """Get heatmap data with optional filters"""
    conditions = ["created_at >= DATE_SUB(NOW(), INTERVAL %s DAY)"]
    params = [days]
    
    if category and category != 'all':
        conditions.append("category = %s")
        params.append(category)
    
    if status and status != 'all':
        conditions.append("status = %s")
        params.append(status)
    
    where_clause = " AND ".join(conditions)
    
    query = f"""
        SELECT 
            category,
            status,
            COUNT(*) as weight
        FROM complaints 
        WHERE {where_clause}
        GROUP BY category, status
        HAVING COUNT(*) > 0
        ORDER BY weight DESC
    """
    
    return await execute_query(query, tuple(params))


async def get_trend_data(days: int = 30, category: str = None):
    """Get trend data over time"""
    conditions = ["created_at >= DATE_SUB(NOW(), INTERVAL %s DAY)"]
    params = [days]
    
    if category and category != 'all':
        conditions.append("category = %s")
        params.append(category)
    
    where_clause = " AND ".join(conditions)
    
    query = f"""
        SELECT 
            DATE(created_at) as date,
            category,
            COUNT(*) as count
        FROM complaints 
        WHERE {where_clause}
        GROUP BY DATE(created_at), category
        ORDER BY date ASC
    """
    
    return await execute_query(query, tuple(params))


