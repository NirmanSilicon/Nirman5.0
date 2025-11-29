-- Set first user as admin
-- Run this in pgAdmin Query Tool or psql

-- First, let's see all users
SELECT email, name, role FROM users;

-- Set the first user (or specific user) as admin
-- Option 1: Set first user by email (replace with your email)
UPDATE users 
SET role = 'admin', updated_at = NOW() 
WHERE email = 'your-email@example.com';

-- Option 2: Set first user in database (if you want to set the first registered user)
-- UPDATE users 
-- SET role = 'admin', updated_at = NOW() 
-- WHERE id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1);

-- Verify the update
SELECT email, name, role FROM users WHERE role = 'admin';

