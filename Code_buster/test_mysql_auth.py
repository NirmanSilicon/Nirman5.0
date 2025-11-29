import pymysql

# Test different password configurations
passwords = ['password', 'KRI27@ks', '', 'root', '123456', 'admin']

for pwd in passwords:
    try:
        print(f"🔍 Testing with password: '{pwd}'")
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password=pwd,
            database='mysql',  # Connect to mysql system database first
            port=3306
        )
        
        # Check if lokai database exists
        with connection.cursor() as cursor:
            cursor.execute("SHOW DATABASES LIKE 'lokai'")
            result = cursor.fetchone()
            
            if result:
                print(f"✅ Connected successfully with password: '{pwd}'")
                print(f"📊 Database 'lokai' exists")
                
                # Check tables
                cursor.execute("USE lokai")
                cursor.execute("SHOW TABLES")
                tables = cursor.fetchall()
                print(f"📋 Tables: {[table[0] for table in tables]}")
                
                connection.close()
                break
            else:
                print(f"✅ Connected but 'lokai' database doesn't exist")
                connection.close()
                break
                
    except Exception as e:
        print(f"❌ Failed with password '{pwd}': {e}")
        continue
else:
    print("🚨 No working password found!")
