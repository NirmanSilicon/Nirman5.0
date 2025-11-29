-- Create medicine-symptom-disease mapping table
-- This table links medicines to symptoms and diseases for better search functionality

CREATE TABLE IF NOT EXISTS medicine_symptom_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    symptom_name VARCHAR(255) NOT NULL,
    relevance_score INTEGER DEFAULT 100, -- 0-100, how relevant this medicine is for this symptom
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medicine_disease_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    disease_name VARCHAR(255) NOT NULL,
    relevance_score INTEGER DEFAULT 100, -- 0-100, how relevant this medicine is for this disease
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_medicine_symptom_medicine ON medicine_symptom_mappings(medicine_id);
CREATE INDEX IF NOT EXISTS idx_medicine_symptom_name ON medicine_symptom_mappings(symptom_name);
CREATE INDEX IF NOT EXISTS idx_medicine_disease_medicine ON medicine_disease_mappings(medicine_id);
CREATE INDEX IF NOT EXISTS idx_medicine_disease_name ON medicine_disease_mappings(disease_name);

