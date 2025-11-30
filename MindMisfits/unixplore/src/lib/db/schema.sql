-- UniXplore Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS club_admins CASCADE;
DROP TABLE IF EXISTS clubs CASCADE;
DROP TABLE IF EXISTS college_admins CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Categories table (predefined)
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Colleges table
CREATE TABLE colleges (
  id SERIAL PRIMARY KEY,
  college_id VARCHAR(12) UNIQUE NOT NULL, -- CLG-XXXXXX format
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  official_website VARCHAR(255),
  official_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, suspended
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- College admins table
CREATE TABLE college_admins (
  id SERIAL PRIMARY KEY,
  college_id INTEGER REFERENCES colleges(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Clubs table
CREATE TABLE clubs (
  id SERIAL PRIMARY KEY,
  college_id INTEGER REFERENCES colleges(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  email VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  about TEXT,
  contact_info JSONB, -- {email, phone, social_links}
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, suspended
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(college_id, slug)
);

-- Club admins table
CREATE TABLE club_admins (
  id SERIAL PRIMARY KEY,
  club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Announcements table
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registrations table
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  registration_link VARCHAR(500),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'open', -- open, closed, upcoming
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table for tracking views
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(20) NOT NULL, -- college, club
  entity_id INTEGER NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- view, search
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_colleges_college_id ON colleges(college_id);
CREATE INDEX idx_colleges_city ON colleges(city);
CREATE INDEX idx_colleges_state ON colleges(state);
CREATE INDEX idx_clubs_college_id ON clubs(college_id);
CREATE INDEX idx_clubs_category_id ON clubs(category_id);
CREATE INDEX idx_clubs_status ON clubs(status);
CREATE INDEX idx_clubs_slug ON clubs(slug);
CREATE INDEX idx_announcements_club_id ON announcements(club_id);
CREATE INDEX idx_registrations_club_id ON registrations(club_id);
CREATE INDEX idx_analytics_entity ON analytics(entity_type, entity_id);

-- Insert predefined categories
INSERT INTO categories (name, slug, color) VALUES
  ('Technical', 'technical', 'hsl(217, 91%, 60%)'),
  ('Cultural', 'cultural', 'hsl(280, 85%, 60%)'),
  ('Social', 'social', 'hsl(142, 71%, 45%)'),
  ('Sports', 'sports', 'hsl(25, 95%, 53%)'),
  ('Media', 'media', 'hsl(340, 82%, 52%)');
