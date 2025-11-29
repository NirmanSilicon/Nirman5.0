-- Create symptoms table for admin-managed symptoms
-- Run this in pgAdmin Query Tool or psql

CREATE TABLE IF NOT EXISTS symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_symptoms_name ON symptoms(name);
CREATE INDEX IF NOT EXISTS idx_symptoms_category ON symptoms(category);
CREATE INDEX IF NOT EXISTS idx_symptoms_is_active ON symptoms(is_active);

-- Insert some default symptoms
INSERT INTO symptoms (name, category, description, is_active) VALUES
('Fever', 'General', 'Elevated body temperature', true),
('Cough', 'Respiratory', 'Persistent coughing', true),
('Headache', 'Neurological', 'Pain in the head', true),
('Fatigue', 'General', 'Feeling tired or weak', true),
('Body Ache', 'Musculoskeletal', 'Pain in muscles or joints', true),
('Sore Throat', 'Respiratory', 'Pain or irritation in the throat', true),
('Runny Nose', 'Respiratory', 'Excessive nasal discharge', true),
('Nausea', 'Digestive', 'Feeling of sickness with inclination to vomit', true),
('Diarrhea', 'Digestive', 'Loose or watery stools', true),
('Vomiting', 'Digestive', 'Forceful expulsion of stomach contents', true),
('Difficulty Breathing', 'Respiratory', 'Shortness of breath or labored breathing', true),
('Chest Pain', 'Cardiovascular', 'Pain or discomfort in the chest area', true),
('Loss of Taste', 'General', 'Inability to taste food', true),
('Loss of Smell', 'General', 'Inability to smell', true)
ON CONFLICT (name) DO NOTHING;

